import express from 'express';
import pool from './db.js';

var router = express.Router();

// Route pour obtenir tous les projets
router.get('/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM project');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
    }
});

// Route pour obtenir les projets par catégorie
router.get('/projects/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const result = await pool.query('SELECT title, link, image, category FROM project WHERE category = $1', [category]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
    }
});

// Route pour obtenir un projet par ID
router.get('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM project WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: 'An error occurred while fetching the project' });
    }
});

// Route pour créer un nouveau projet
router.post('/projects', async (req, res) => {
    const { title, link, image, category } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO project (title, link, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, link, image, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the project' });
    }
});

// Route pour mettre à jour un projet par ID
router.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, link, image, category } = req.body;
    try {
        const result = await pool.query(
            'UPDATE project SET title = $1, link = $2, image = $3, category = $4 WHERE id = $5 RETURNING *',
            [title, link, image, category, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the project' });
    }
});

// Route pour supprimer un projet par ID
router.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM project WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the project' });
    }
});

export default router;
