const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM categories').all();
        const categoryObj = {};
        categories.forEach(c => {
            categoryObj[c.id] = c.name;
        });
        res.json(categoryObj);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// For offline caching, send everything
router.get('/all', (req, res) => {
    try {
        const questions = db.prepare('SELECT * FROM questions').all();
        const formatted = questions.map(q => ({
            ...q,
            options: JSON.parse(q.options)
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
