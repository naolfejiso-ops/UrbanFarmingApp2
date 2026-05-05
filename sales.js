const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT ms.*, c.Crop_Name
    FROM Market_Sales ms
    LEFT JOIN Harvest h ON ms.Harvest_ID = h.Harvest_ID
    LEFT JOIN Crop c ON h.Crop_ID = c.Crop_ID
    ORDER BY ms.Sale_Date DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Harvest_ID, Sale_Date, Buyer_Name, Quantity_sold, Unit_Price, Payment_Status } = req.body;
  const [result] = await db.query(
    'INSERT INTO Market_Sales (Harvest_ID, Sale_Date, Buyer_Name, Quantity_sold, Unit_Price, Payment_Status) VALUES (?,?,?,?,?,?)',
    [Harvest_ID, Sale_Date, Buyer_Name, Quantity_sold, Unit_Price, Payment_Status]
  );
  res.status(201).json({ Sales_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Harvest_ID, Sale_Date, Buyer_Name, Quantity_sold, Unit_Price, Payment_Status } = req.body;
  await db.query(
    'UPDATE Market_Sales SET Harvest_ID=?, Sale_Date=?, Buyer_Name=?, Quantity_sold=?, Unit_Price=?, Payment_Status=? WHERE Sales_ID=?',
    [Harvest_ID, Sale_Date, Buyer_Name, Quantity_sold, Unit_Price, Payment_Status, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Market_Sales WHERE Sales_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
