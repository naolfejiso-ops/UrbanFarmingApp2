const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Crop ORDER BY Crop_ID DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Crop WHERE Crop_ID = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { Crop_Name, Category, Water_Needs, Grow_Season } = req.body;
  const [result] = await db.query(
    'INSERT INTO Crop (Crop_Name, Category, Water_Needs, Grow_Season) VALUES (?, ?, ?, ?)',
    [Crop_Name, Category, Water_Needs, Grow_Season]
  );
  res.status(201).json({ Crop_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Crop_Name, Category, Water_Needs, Grow_Season } = req.body;
  await db.query(
    'UPDATE Crop SET Crop_Name=?, Category=?, Water_Needs=?, Grow_Season=? WHERE Crop_ID=?',
    [Crop_Name, Category, Water_Needs, Grow_Season, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Crop WHERE Crop_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
