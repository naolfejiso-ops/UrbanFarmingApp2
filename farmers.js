const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Farmer ORDER BY Farmer_ID DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Farmer WHERE Farmer_ID = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { Name, Email, Phone_No, Age } = req.body;
  const [result] = await db.query(
    'INSERT INTO Farmer (Name, Email, Phone_No, Age) VALUES (?, ?, ?, ?)',
    [Name, Email, Phone_No, Age]
  );
  res.status(201).json({ Farmer_ID: result.insertId, Name, Email, Phone_No, Age });
});

router.put('/:id', async (req, res) => {
  const { Name, Email, Phone_No, Age } = req.body;
  await db.query(
    'UPDATE Farmer SET Name=?, Email=?, Phone_No=?, Age=? WHERE Farmer_ID=?',
    [Name, Email, Phone_No, Age, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Farmer WHERE Farmer_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
