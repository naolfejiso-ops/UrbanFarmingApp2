const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT fp.*, f.Name AS Farmer_Name
    FROM Farm_Plot fp
    LEFT JOIN Farmer f ON fp.Farmer_ID = f.Farmer_ID
    ORDER BY fp.Plot_ID DESC
  `);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query(`
    SELECT fp.*, f.Name AS Farmer_Name
    FROM Farm_Plot fp
    LEFT JOIN Farmer f ON fp.Farmer_ID = f.Farmer_ID
    WHERE fp.Plot_ID = ?
  `, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });

  const [crops] = await db.query(`
    SELECT c.* FROM Crop c
    JOIN Plot_Crop_Grows pcg ON c.Crop_ID = pcg.Crop_ID
    WHERE pcg.Plot_ID = ?
  `, [req.params.id]);

  res.json({ ...rows[0], crops });
});

router.post('/', async (req, res) => {
  const { Farmer_ID, Area_m2, Location, Status } = req.body;
  const [result] = await db.query(
    'INSERT INTO Farm_Plot (Farmer_ID, Area_m2, Location, Status) VALUES (?, ?, ?, ?)',
    [Farmer_ID, Area_m2, Location, Status]
  );
  res.status(201).json({ Plot_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Farmer_ID, Area_m2, Location, Status } = req.body;
  await db.query(
    'UPDATE Farm_Plot SET Farmer_ID=?, Area_m2=?, Location=?, Status=? WHERE Plot_ID=?',
    [Farmer_ID, Area_m2, Location, Status, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Farm_Plot WHERE Plot_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
