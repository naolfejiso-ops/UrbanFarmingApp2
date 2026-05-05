const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [[farmers]]    = await db.query('SELECT COUNT(*) AS count FROM Farmer');
  const [[crops]]      = await db.query('SELECT COUNT(*) AS count FROM Crop');
  const [[plots]]      = await db.query('SELECT COUNT(*) AS count FROM Farm_Plot');
  const [[activePlots]]= await db.query("SELECT COUNT(*) AS count FROM Farm_Plot WHERE Status='Active'");
  const [[sensors]]    = await db.query('SELECT COUNT(*) AS count FROM Sensor');
  const [[harvests]]   = await db.query('SELECT COUNT(*) AS count FROM Harvest');
  const [[totalKg]]    = await db.query('SELECT COALESCE(SUM(Quantity_kg),0) AS total FROM Harvest');
  const [[revenue]]    = await db.query("SELECT COALESCE(SUM(Quantity_sold * Unit_Price),0) AS total FROM Market_Sales WHERE Payment_Status='Paid'");
  const [[pendingAlerts]] = await db.query("SELECT COUNT(*) AS count FROM Alert WHERE Severity_Status='Pending'");

  const [recentHarvests] = await db.query(`
    SELECT h.Harvest_Date, h.Quantity_kg, h.Quality, c.Crop_Name
    FROM Harvest h LEFT JOIN Crop c ON h.Crop_ID = c.Crop_ID
    ORDER BY h.Harvest_Date DESC LIMIT 5
  `);

  const [salesByBuyer] = await db.query(`
    SELECT Buyer_Name, SUM(Quantity_sold * Unit_Price) AS total
    FROM Market_Sales WHERE Payment_Status='Paid'
    GROUP BY Buyer_Name ORDER BY total DESC
  `);

  const [cropHarvest] = await db.query(`
    SELECT c.Crop_Name, SUM(h.Quantity_kg) AS total_kg
    FROM Harvest h LEFT JOIN Crop c ON h.Crop_ID = c.Crop_ID
    GROUP BY c.Crop_Name ORDER BY total_kg DESC
  `);

  res.json({
    stats: {
      farmers: farmers.count,
      crops: crops.count,
      plots: plots.count,
      activePlots: activePlots.count,
      sensors: sensors.count,
      harvests: harvests.count,
      totalKg: parseFloat(totalKg.total),
      revenue: parseFloat(revenue.total),
      pendingAlerts: pendingAlerts.count,
    },
    recentHarvests,
    salesByBuyer,
    cropHarvest,
  });
});

module.exports = router;
