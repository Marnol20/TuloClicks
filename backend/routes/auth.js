const express = require('express');
const router = express.Router();
const db = require('../db');

// SIGNUP
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  const checkSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkSql, [email], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const role = email === 'admin@gmail.com' ? 'admin' : 'user';

    const insertSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [name, email, password, role], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).json({ error: insertErr.message });
      }

      res.status(201).json({
        message: 'Account created successfully',
        id: result.insertId
      });
    });
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  const sql = 'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        role: result[0].role
      }
    });
  });
});

module.exports = router;