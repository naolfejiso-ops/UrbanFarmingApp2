const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT s.*, fp.Location AS Plot_Location
    FROM Sensor s
    LEFT JOIN Farm_Plot fp ON s.Plot_ID = fp.Plot_ID
    ORDER BY s.Sensor_ID DESC
  `);
  res.json(rows);
});

router.get('/:id/readings', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM Sensor_Reading WHERE Sensor_ID = ? ORDER BY Timestamp DESC LIMIT 50',
    [req.params.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Plot_ID, Sensor_Type, Install_Date, Location } = req.body;
  const [result] = await db.query(
    'INSERT INTO Sensor (Plot_ID, Sensor_Type, Install_Date, Location) VALUES (?, ?, ?, ?)',
    [Plot_ID, Sensor_Type, Install_Date, Location]
  );
  res.status(201).json({ Sensor_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Plot_ID, Sensor_Type, Install_Date, Location } = req.body;
  await db.query(
    'UPDATE Sensor SET Plot_ID=?, Sensor_Type=?, Install_Date=?, Location=? WHERE Sensor_ID=?',
    [Plot_ID, Sensor_Type, Install_Date, Location, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Sensor WHERE Sensor_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

// Post a new reading
router.post('/:id/readings', async (req, res) => {
  const { Value, Unit } = req.body;
  const [result] = await db.query(
    'INSERT INTO Sensor_Reading (Sensor_ID, Value, Unit) VALUES (?, ?, ?)',
    [req.params.id, Value, Unit]
  );
  res.status(201).json({ Reading_ID: result.insertId });
});

module.exports = router;
