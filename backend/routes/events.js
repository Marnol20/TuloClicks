const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    // Selects the 'name' column as seen in your phpMyAdmin
    const sql = "SELECT id, name FROM events ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

module.exports = router;