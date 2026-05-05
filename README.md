# Urban Farm Manager — Full Stack App

A Node.js/Express backend + HTML frontend for managing your UrbanFarmingDB MySQL database.

---

## Project Structure

```
urbanfarm-backend/
├── server.js              ← Express entry point
├── .env.example           ← Copy to .env and fill in your DB credentials
├── src/
│   ├── db.js              ← MySQL connection pool
│   └── routes/
│       ├── dashboard.js   ← Summary stats & charts data
│       ├── farmers.js
│       ├── crops.js
│       ├── plots.js
│       ├── sensors.js
│       ├── harvests.js
│       ├── sales.js
│       ├── equipment.js
│       ├── tasks.js
│       ├── alerts.js
│       └── logs.js
└── frontend/
    └── index.html         ← Complete single-file frontend (open in browser)
```

---

## Setup & Run

### 1. Configure the database

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

Make sure your MySQL server is running and the `UrbanFarmingDB` database exists (run your `UrbanFarming_Schema.sql` first).

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend

```bash
node server.js
# → Urban Farm API running on port 3001
```

### 4. Open the frontend

Open `frontend/index.html` in your browser. That's it — no build step needed.

> **Note**: If you see a connection warning, make sure the backend is running on port 3001.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Summary stats + chart data |
| GET/POST | `/api/farmers` | List / create farmers |
| GET/PUT/DELETE | `/api/farmers/:id` | Read / update / delete farmer |
| GET/POST | `/api/crops` | Crops CRUD |
| GET/POST | `/api/plots` | Farm plots CRUD |
| GET/POST | `/api/sensors` | Sensors CRUD |
| GET/POST | `/api/sensors/:id/readings` | Get/add readings for a sensor |
| GET/POST | `/api/harvests` | Harvests CRUD |
| GET/POST | `/api/sales` | Market sales CRUD |
| GET/POST | `/api/equipment` | Equipment CRUD |
| GET/POST | `/api/tasks` | Tasks CRUD |
| GET/POST | `/api/alerts` | Alerts list |
| PUT | `/api/alerts/:id` | Update alert status |
| GET/POST | `/api/logs` | Fertilizer/Pesticide logs CRUD |
| GET | `/api/health` | Health check |

---

## Frontend Features

- **Dashboard** — 8 stat cards, bar charts (harvest by crop, revenue by buyer), recent harvests table
- **Farmers / Crops / Plots / Sensors / Harvests / Sales / Equipment / Tasks / Logs** — full CRUD with modal forms
- **Alerts** — view all alerts with resolve button for pending ones
- Responsive sidebar navigation
- Toast notifications on save/delete
- Graceful error message when backend is unreachable
