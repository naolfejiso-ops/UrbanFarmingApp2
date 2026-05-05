const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT a.*, sr.Value, sr.Unit, sr.Sensor_ID FROM Alert a
    LEFT JOIN Sensor_Reading sr ON a.Reading_ID = sr.Reading_ID
    ORDER BY a.Timestamp DESC
  `);
  res.json(rows);
});

router.put('/:id', async (req, res) => {
  const { Severity_Status } = req.body;
  await db.query('UPDATE Alert SET Severity_Status=? WHERE Alert_ID=?', [Severity_Status, req.params.id]);
  res.json({ message: 'Updated' });
});

module.exports = router;
