const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all speakers from database
router.get('/', (req, res) => {
    const sql = "SELECT * FROM speakers ORDER BY id DESC";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("GET Error:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
});

// POST a new speaker
router.post('/', (req, res) => {
    const { name, role, event, email } = req.body;

    if (!name || !role || !event || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO speakers (`name`, `role`, `event`, `email`) VALUES (?, ?, ?, ?)";
    const values = [name, role, event, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("POST Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: "Speaker added successfully", id: result.insertId });
    });
});

module.exports = router;