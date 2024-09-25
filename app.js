import express from 'express'; // Importation du framework Express pour gérer le serveur
import path from 'path'; // Importation du module path pour la gestion des chemins de fichiers
import cookieParser from 'cookie-parser'; // Importation du middleware pour parser les cookies
import logger from 'morgan'; // Importation du middleware pour les logs HTTP
import createError from 'http-errors'; // Importation pour créer des erreurs HTTP
import i18next from 'i18next'; // Importation de la bibliothèque i18next pour la gestion des traductions
import Backend from 'i18next-node-fs-backend'; // Importation du backend pour charger les traductions depuis le système de fichiers
import i18nextMiddleware from 'i18next-http-middleware'; // Importation du middleware pour i18next avec Express
import session from 'express-session'; // Importation pour la gestion des sessions
// import pg from 'pg'; // Importation du client PostgreSQL
import pgSession from 'connect-pg-simple'; // Importation du store PostgreSQL pour les sessions
import passport from 'passport'; // Importation de Passport pour l'authentification
import bcrypt from 'bcrypt'; // Importation pour le chiffrement des mots de passe
import { Strategy as LocalStrategy } from "passport-local";
// Importation des routes
import pool from './routes/db.js'; // Importation du pool de connexions à la base de données
import indexRouter from './routes/index.js'; // Importation du routeur principal
import projectsRouter from './routes/projects.js'; // Importation du routeur pour les projets
import skillsRouter from './routes/skills.js'; // Importation du routeur pour les compétences
import usersRouter from './routes/users.js'; // Importation du routeur pour les utilisateurs
import bootcampRouter from './routes/bootcamps.js'; // Importation du routeur pour les bootcamps
import authRouter from './routes/auth.js'; // Importation du routeur pour l'authentification

const app = express(); // Création de l'application Express

// // Configuration de la base de données pour les sessions
// const { Pool } = pg;
// const sessionPool = new Pool({
//     user: process.env.DB_USER, // Nom d'utilisateur PostgreSQL
//     host: process.env.DB_HOST, // Adresse du serveur PostgreSQL
//     database: process.env.DB_NAME, // Nom de la base de données
//     password: process.env.DB_PASSWORD, // Mot de passe de l'utilisateur
//     port: process.env.DB_PORT, // Port PostgreSQL (par défaut 5432)
// });

// Utilisation de connect-pg-simple pour gérer les sessions avec PostgreSQL
const PgSession = pgSession(session);

// Configuration de la session pour utiliser PostgreSQL
app.use(
    session({
        store: new PgSession({
            pool: pool, // Pool de connexions PostgreSQL pour stocker les sessions
            tableName: 'session', // Nom de la table pour stocker les sessions
        }),
        secret: process.env.SESSION_SECRET, // Un secret pour signer le cookie de session
        resave: false, // Ne pas sauvegarder la session si elle n'est pas modifiée
        saveUninitialized: false, // Ne pas créer de session vide
        cookie: {
            secure: false, // Utilisez `secure: true` si vous utilisez HTTPS
            httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
            maxAge: 24 * 60 * 60 * 1000 // Durée de vie du cookie en millisecondes (ici, 24 heures)
        }
    })
);

// Configuration d'i18next pour la gestion des traductions
i18next
    .use(Backend) // Utilisation du backend pour charger les fichiers de traduction
    .use(i18nextMiddleware.LanguageDetector) // Utilisation du détecteur de langue pour déterminer la langue de l'utilisateur
    .init({
        fallbackLng: 'en', // Langue de secours si la langue demandée n'est pas disponible
        preload: ['en', 'fr'], // Langues à précharger
        ns: ['navbar', 'home', 'about', 'education', 'skills', 'projects', 'contact', 'footer'], // Espaces de noms pour les fichiers de traduction
        defaultNS: 'navbar',
        backend: {
            loadPath: path.join(path.dirname(new URL(import.meta.url).pathname), '/public/locales/{{lng}}/{{ns}}.json') // Chemin vers les fichiers de traduction
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

// Initialisation de Passport.js pour l'authentification
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api', authRouter); // Route pour l'authentification

// Sérialisation de l'utilisateur pour Passport.js
passport.serializeUser((user, done) => {
    done(null, user.id); // Sérialisation de l'utilisateur par son ID
});

// Désérialisation de l'utilisateur pour Passport.js
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]); // Si l'utilisateur est trouvé, on le désérialise
        } else {
            done(new Error('User not found'), null); // Si l'utilisateur n'est pas trouvé
        }
    } catch (err) {
        done(err, null); // En cas d'erreur
    }
});

// Configuration de la stratégie Passport.js pour l'authentification locale
passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } else {
            return done(null, false, { message: 'No user with that email address.' });
        }
    } catch (err) {
        return done(err);
    }
}));

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
