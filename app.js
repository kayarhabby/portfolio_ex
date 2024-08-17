import express from 'express'; // Importation du framework Express pour gérer le serveur
import path from 'path'; // Importation du module path pour la gestion des chemins de fichiers
import cookieParser from 'cookie-parser'; // Importation du middleware pour parser les cookies
import logger from 'morgan'; // Importation du middleware pour les logs HTTP
import createError from 'http-errors'; // Importation pour créer des erreurs HTTP
import i18next from 'i18next'; // Importation de la bibliothèque i18next pour la gestion des traductions
import Backend from 'i18next-node-fs-backend'; // Importation du backend pour charger les traductions depuis le système de fichiers
import i18nextMiddleware from 'i18next-http-middleware'; // Importation du middleware pour i18next avec Express
import Memcached from 'memcached'; // Importation du client Memcached pour le caching

import pool from './routes/db.js'; // Importation du pool de connexions à la base de données
import indexRouter from './routes/index.js'; // Importation du routeur principal
import projectsRouter from './routes/projects.js'; // Importation du routeur pour les projets
import skillsRouter from './routes/skills.js'; // Importation du routeur pour les compétences
import usersRouter from './routes/users.js'; // Importation du routeur pour les utilisateurs
import bootcampRouter from './routes/bootcamps.js'; // Importation du routeur pour les bootcamps

const app = express(); // Création de l'application Express

// Configuration de Memcached
const memcachedClient = new Memcached('localhost:11211'); // Initialisation du client Memcached pour le caching

// Configuration d'i18next
i18next
    .use(Backend) // Utilisation du backend pour charger les fichiers de traduction
    .use(i18nextMiddleware.LanguageDetector) // Utilisation du détecteur de langue pour déterminer la langue de l'utilisateur
    .init({
        fallbackLng: 'en', // Langue de secours si la langue demandée n'est pas disponible
        preload: ['en', 'fr'], // Langues à précharger
        ns: ['navbar'], // Espaces de noms pour les fichiers de traduction (ex: 'navbar' pour les traductions de la barre de navigation)
        backend: {
            loadPath: path.join(path.dirname(new URL(import.meta.url).pathname), '/public/locales/{{lng}}/{{ns}}.json') // Chemin vers les fichiers de traduction
        },
        cache: {
            enabled: true, // Activer le cache
            get: (lng, ns, cb) => {
                const key = `i18next_${lng}_${ns}`; // Génération de la clé pour le cache
                memcachedClient.get(key, (err, data) => {
                    if (err) return cb(err, null); // Gestion des erreurs
                    return cb(null, data ? JSON.parse(data) : null); // Récupération des données du cache
                });
            },
            set: (lng, ns, data) => {
                const key = `i18next_${lng}_${ns}`; // Génération de la clé pour le cache
                memcachedClient.set(key, JSON.stringify(data), 24 * 60 * 60, (err) => {
                    if (err) console.error('Memcached set error:', err); // Gestion des erreurs
                });
            }
        }
    });

// Middleware i18next pour Express
app.use(i18nextMiddleware.handle(i18next)); // Intégration de i18next avec Express

// Middleware pour rendre req.t disponible dans les vues
app.use((req, res, next) => {
    res.locals.t = req.t; // Expose la fonction de traduction aux vues
    res.locals.language = req.language; // Expose la langue actuelle aux vues
    next();
});

// Configuration du moteur de vue
app.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views')); // Définition du répertoire des vues
app.set('view engine', 'ejs'); // Définition du moteur de vue à utiliser (EJS)

app.use(logger('dev')); // Utilisation du middleware de logging HTTP
app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use(express.urlencoded({ extended: false })); // Middleware pour parser les requêtes URL-encoded
app.use(cookieParser()); // Middleware pour parser les cookies
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'public'))); // Servir les fichiers statiques

// Routes de l'application
app.use('/', indexRouter); // Route principale
app.use('/api', projectsRouter); // Route pour les projets
app.use('/api', skillsRouter); // Route pour les compétences
app.use('/api', usersRouter); // Route pour les utilisateurs
app.use('/api', bootcampRouter); // Route pour les bootcamps

// Gestion des erreurs 404
app.use((req, res, next) => {
    next(createError(404)); // Création d'une erreur 404 si la route n'est pas trouvée
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
    res.locals.message = err.message; // Expose le message d'erreur aux vues
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // Expose l'erreur si en mode développement

    res.status(err.status || 500); // Définir le code de statut de la réponse
    res.render('error'); // Rendu de la vue d'erreur
});

// Fermeture du pool de connexions à la base de données lors de l'arrêt de l'application
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Pool has ended'); // Message de confirmation de la fermeture du pool
        process.exit(0); // Sortie propre du processus
    });
});

export default app; // Export de l'application Express
