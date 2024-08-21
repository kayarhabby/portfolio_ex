// routes/auth.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    console.log('Received credentials:', email, password); // Pour déboguer

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    passport.authenticate('local', (err, user, info) => {
        console.log('user : ', user);
        if (err) return next(err);
        if (!user) return res.status(401).json({ success: false, message: info.message });
        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ success: true, message: 'Login successful' });
        });
    })(req, res, next);
});

// Route pour la déconnexion
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/dashboard');
        }
        res.redirect('/');
    });
});



// Route pour accéder au tableau de bord
router.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { title: 'Express' });
    } else {
        res.redirect("/login");
    }
});

// Stratégie de base sans passport en utilisant juste bcrypt

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//
//     console.log('Email:', email);
//     console.log('Password:', password);
//
//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: 'Email and password are required' });
//     }
//     const loginPassword = password;
//
//     try {
//         const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//         if (response.rows.length > 0) {
//             const user = response.rows[0];
//             const storedHashedPassword = user.password;
//
//             // Vérification du mot de passe avec bcrypt
//             const match = await bcrypt.compare(loginPassword, storedHashedPassword);
//             if (match) {
//                 // Stocker les informations utilisateur dans la session
//                 req.session.userId = user.id;
//                 req.session.email = user.email;
//                 req.session.isAuthenticated = true;
//
//                 // Réponse JSON en cas de succès
//                 res.json({ success: true, message: 'Login successful' });
//             } else {
//                 res.status(401).json({ success: false, message: 'Incorrect Password' });
//             }
//         } else {
//             res.status(404).json({ success: false, message: 'User not found' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
//     }
// });
//
// const ensureAuthenticated = (req, res, next) => {
//     if (req.session.isAuthenticated) {
//         return next();
//     } else {
//         res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
// };
//
//
// router.get('/dashboard', ensureAuthenticated, (req, res) => {
//     res.render('dashboard', { title: 'Express' });
// });
//
// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Could not log out' });
//         }
//         res.redirect('/');
//     });
// });


export default router;