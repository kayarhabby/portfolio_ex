import express from 'express';
import pool from './db.js';

const router = express.Router();

router.get('/skills', async (req, res) => {
    try {
        const result = await pool.query('SELECT titre, image, categorie FROM competences');
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occurred while fetching competences'
        });
    }
});

router.get('/skills/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const result = await pool.query('SELECT titre, image, categorie FROM competences WHERE categorie = $1', [category]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occurred while fetching competences'
        });
    }
});

export default router;
