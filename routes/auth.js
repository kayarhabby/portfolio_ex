import express from 'express';
// import passport from 'passport';
import bcrypt from 'bcrypt';
import pool from './db.js'; // Assurez-vous que le chemin est correct
// import { Strategy } from 'passport-local';

const router = express.Router();

// // Initialisation de Passport
// passport.use(new Strategy(async (email, password, done) => {
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (isMatch) {
//                 console.log('User authenticated successfully:', user);
//                 return done(null, user);
//             } else {
//                 console.log('Password mismatch');
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//         } else {
//             console.log('User not found');
//             return done(null, false, { message: 'No user with that email address.' });
//         }
//     } catch (err) {
//         console.error('Database query error:', err);
//         return done(err);
//     }
// }));
//
//
// passport.serializeUser((user, done) => {
//     console.log('Serializing user:', user);
//     done(null, user.id); // Vous pouvez stocker uniquement l'identifiant de l'utilisateur pour la sérialisation
// });
//
// passport.deserializeUser(async (id, done) => {
//     try {
//         const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             console.log('Deserialized user:', user);
//             done(null, user);
//         } else {
//             console.log('User not found during deserialization');
//             done(new Error('User not found'));
//         }
//     } catch (err) {
//         console.error('Database query error during deserialization:', err);
//         done(err);
//     }
// });
//
// // Middleware pour authentification
// router.post('/login', (req, res, next) => {
//     const { email, password } = req.body;
//     console.log('Received credentials:', email, password); // Pour déboguer
//
//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: 'Email and password are required.' });
//     }
//
//     passport.authenticate('local', (err, user, info) => {
//         if (err) return next(err);
//         if (!user) return res.status(401).json({ success: false, message: info.message });
//         req.login(user, (err) => {
//             if (err) return next(err);
//             res.json({ success: true, message: 'Login successful' });
//         });
//     })(req, res, next);
// });
//
//
//
// // Route pour la déconnexion
// router.get('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.redirect('/dashboard');
//         }
//         res.redirect('/');
//     });
// });
//
// // Route pour accéder au tableau de bord
// router.get('/dashboard', (req, res, next) => {
//     if (req.isAuthenticated()) {
//         res.render('dashboard', { title: 'Express' });
//     } else {
//         res.redirect("/login");
//     }
// });

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const loginPassword = req.body.password;

    try {
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (response.rows.length > 0) {
            const user = response.rows[0];
            const storedHashedPassword = user.password;

            // Vérification du mot de passe avec bcrypt
            const match = await bcrypt.compare(loginPassword, storedHashedPassword);
            if (match) {
                // Stocker les informations utilisateur dans la session
                req.session.userId = user.id;
                req.session.email = user.email;
                req.session.isAuthenticated = true;

                // Réponse JSON en cas de succès
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect Password' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});

const ensureAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};


router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { title: 'Express' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        res.redirect('/');
    });
});


export default router;