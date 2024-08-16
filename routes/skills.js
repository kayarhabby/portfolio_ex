import express from 'express';
import pool from './db.js';

var router = express.Router();

router.get('/skills', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM skill');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching skills' });
    }
});

router.get('/skills/:category', async (req, res) => {
    const category = req.params.category;
    console.log(category);
    try {
        const result = await pool.query('SELECT title, image, category FROM skill WHERE category = $1', [category]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occurred while fetching skills'
        });
    }
});

router.post('/skills', async (req, res) => {
    const { title, image, category } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO skill (title, image, category) VALUES ($1, $2, $3) RETURNING *',
            [title, image, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the skill' });
    }
});

router.put('/skills/:id', async (req, res) => {
    const { id } = req.params;
    const { title, image, category } = req.body;
    try {
        const result = await pool.query(
            'UPDATE skill SET title = $1, image = $2, category = $3 WHERE id = $4 RETURNING *',
            [title, image, category, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the skill' });
    }
});


router.delete('/skills/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM skill WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the skill' });
    }
});


export default router;
