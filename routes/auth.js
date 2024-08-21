import express from 'express';
import pool from './db.js';
import bcrypt from 'bcrypt';

var router = express.Router();

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const loginPassword = req.body.password;
    console.log(email);
    console.log(loginPassword);

    try {
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        console.log(response.rows[0])
        if (response.rows.length > 0) {
            const user = response.rows[0];
            const storedHashedPassword = user.password;

            // Vérification du mot de passe avec bcrypt
            const match = await bcrypt.compare(loginPassword, storedHashedPassword);
            if (match) {
                // Réponse JSON en cas de succès
                res.json({ success: true, message: 'Login successful' });
            } else {
                // Réponse JSON en cas de mot de passe incorrect
                res.status(401).json({ success: false, message: 'Incorrect Password' });
            }
        } else {
            // Réponse JSON en cas d'utilisateur non trouvé
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});

export default router;
