import express from 'express';
import pool from './db.js';

var router = express.Router();

router.get('/bootcamps', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bootcamp');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching bootcamps' });
    }
});

router.post('/bootcamps', async (req, res) => {
    const { date, title, description, image, certification } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bootcamp (date, title, description, image, certification) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [date, title, description, image, certification]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the bootcamp' });
    }
});


router.put('/bootcamps/:id', async (req, res) => {
    const { id } = req.params;
    const { date, title, description, image, certification } = req.body;
    try {
        const result = await pool.query(
            'UPDATE bootcamp SET date = $1, title = $2, description = $3, image = $4, certification = $5 WHERE id = $6 RETURNING *',
            [date, title, description, image, certification, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Bootcamp not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the bootcamp' });
    }
});

router.delete('/bootcamps/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM bootcamp WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Bootcamp not found' });
        }
        res.status(200).json({ message: 'Bootcamp deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the bootcamp' });
    }
});


export default router;
