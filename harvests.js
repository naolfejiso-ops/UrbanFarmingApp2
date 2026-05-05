// harvests.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT h.*, c.Crop_Name FROM Harvest h
    LEFT JOIN Crop c ON h.Crop_ID = c.Crop_ID
    ORDER BY h.Harvest_Date DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Crop_ID, Harvest_Date, Quantity_kg, Quality } = req.body;
  const [result] = await db.query(
    'INSERT INTO Harvest (Crop_ID, Harvest_Date, Quantity_kg, Quality) VALUES (?, ?, ?, ?)',
    [Crop_ID, Harvest_Date, Quantity_kg, Quality]
  );
  res.status(201).json({ Harvest_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Crop_ID, Harvest_Date, Quantity_kg, Quality } = req.body;
  await db.query(
    'UPDATE Harvest SET Crop_ID=?, Harvest_Date=?, Quantity_kg=?, Quality=? WHERE Harvest_ID=?',
    [Crop_ID, Harvest_Date, Quantity_kg, Quality, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Harvest WHERE Harvest_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
