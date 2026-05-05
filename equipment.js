const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT e.*, f.Name AS Farmer_Name FROM Equipment e
    LEFT JOIN Farmer f ON e.Farmer_ID = f.Farmer_ID
    ORDER BY e.Equipment_ID DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Farmer_ID, Equipment_Name, Equipment_Type, Status } = req.body;
  const [result] = await db.query(
    'INSERT INTO Equipment (Farmer_ID, Equipment_Name, Equipment_Type, Status) VALUES (?,?,?,?)',
    [Farmer_ID, Equipment_Name, Equipment_Type, Status]
  );
  res.status(201).json({ Equipment_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Farmer_ID, Equipment_Name, Equipment_Type, Status } = req.body;
  await db.query(
    'UPDATE Equipment SET Farmer_ID=?, Equipment_Name=?, Equipment_Type=?, Status=? WHERE Equipment_ID=?',
    [Farmer_ID, Equipment_Name, Equipment_Type, Status, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Equipment WHERE Equipment_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
