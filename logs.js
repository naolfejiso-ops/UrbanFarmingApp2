const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT l.*, c.Crop_Name FROM Fertilizer_Pesticide_Log l
    LEFT JOIN Crop c ON l.Crop_ID = c.Crop_ID
    ORDER BY l.Date_Applied DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Crop_ID, Log_Type, Date_Applied, Dosage_ml, Method } = req.body;
  const [result] = await db.query(
    'INSERT INTO Fertilizer_Pesticide_Log (Crop_ID, Log_Type, Date_Applied, Dosage_ml, Method) VALUES (?,?,?,?,?)',
    [Crop_ID, Log_Type, Date_Applied, Dosage_ml, Method]
  );
  res.status(201).json({ Log_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Crop_ID, Log_Type, Date_Applied, Dosage_ml, Method } = req.body;
  await db.query(
    'UPDATE Fertilizer_Pesticide_Log SET Crop_ID=?, Log_Type=?, Date_Applied=?, Dosage_ml=?, Method=? WHERE Log_ID=?',
    [Crop_ID, Log_Type, Date_Applied, Dosage_ml, Method, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Fertilizer_Pesticide_Log WHERE Log_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
