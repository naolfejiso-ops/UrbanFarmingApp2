require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/farmers',   require('./farmers'));
app.use('/api/crops',     require('./crops'));
app.use('/api/plots',     require('./plots'));
app.use('/api/sensors',   require('./sensors'));
app.use('/api/harvests',  require('./harvests'));
app.use('/api/sales',     require('./sales'));
app.use('/api/equipment', require('./equipment'));
app.use('/api/tasks',     require('./tasks'));
app.use('/api/alerts',    require('./alerts'));
app.use('/api/logs',      require('./logs'));
app.use('/api/dashboard', require('./dashboard'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
const path = require('path');
app.use(express.static(path.join(__dirname, '.')));

app.listen(PORT, () => console.log(`Urban Farm API running on port ${PORT}`));
