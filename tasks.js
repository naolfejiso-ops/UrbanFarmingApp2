const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT t.*, e.Equipment_Name FROM Task t
    LEFT JOIN Equipment e ON t.Equipment_ID = e.Equipment_ID
    ORDER BY t.DueDate ASC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { Equipment_ID, Task_Name, Priority, DueDate } = req.body;
  const [result] = await db.query(
    'INSERT INTO Task (Equipment_ID, Task_Name, Priority, DueDate) VALUES (?,?,?,?)',
    [Equipment_ID, Task_Name, Priority, DueDate]
  );
  res.status(201).json({ Task_ID: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { Equipment_ID, Task_Name, Priority, DueDate } = req.body;
  await db.query(
    'UPDATE Task SET Equipment_ID=?, Task_Name=?, Priority=?, DueDate=? WHERE Task_ID=?',
    [Equipment_ID, Task_Name, Priority, DueDate, req.params.id]
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Task WHERE Task_ID = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
