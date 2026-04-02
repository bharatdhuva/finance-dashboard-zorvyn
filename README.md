<div align="center">
  <h1>Zorvyn Finance Dashboard</h1>
  <p><strong>Clean • Modern • Role-Based</strong> Finance Dashboard</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Zustand-FF8A00?style=for-the-badge" alt="Zustand" />
  <img src="https://img.shields.io/badge/Recharts-00C4B4?style=for-the-badge" alt="Recharts" />
</div>

---

## About the Project

**Zorvyn Finance Dashboard** is a clean, interactive, and fully responsive frontend-only finance dashboard built for the **Finance Dashboard UI assignment**.

It gives a complete view of financial activity through summary cards, transaction management, spending insights, and role-based UI behavior.

No backend or authentication server is used. Everything is handled on the frontend with mock data and persisted local state.

---

## Key Features

### 1. Dashboard Overview
- Four summary cards: **Total Balance**, **Total Income**, **Total Expenses**, **Savings Rate**
- **Monthly spending trend** graph
- **Expense composition** donut chart with category breakdown
- **Weekly Expense Tracker** section

### 2. Transactions Ledger
- Complete transaction table with **Date, Description, Category, Type, Amount**
- Search by description or category
- Filter by Income / Expense
- Sort by Date and Amount
- **Admin-only** actions: Add, Edit, Delete transactions
- CSV export for filtered transactions
- Beautiful empty state handling

### 3. Insights & Analysis
- Highest spending category
- Lowest spending category
- Month-over-Month expense comparison
- Top income source
- Monthly inflow vs outflow bar chart

### 4. Role-Based UI
- **Viewer Mode**: Read-only access
- **Admin Mode**: Full transaction actions (Add, Edit, Delete, Bulk Delete)
- Role switching via sidebar dropdown with instant UI updates

### Additional Highlights
- Fully responsive design for desktop and mobile
- Dark / Light mode with persistence
- Custom toast notifications
- Loading skeletons
- Data persistence using localStorage
- Floating Action Button for Admin add action

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Mock seeded records

---

## Run Locally

```bash
npm install
npm run dev
```

If the default Vite port is already in use, it automatically switches to the next available port.

---

## Build & Test

```bash
npm run build
npm run test
```

---

## View Live Deployment

[![View Live Deployment](https://img.shields.io/badge/View-Live%20Deployment-22c55e?style=for-the-badge)](YOUR_VERCEL_LINK_HERE)

> Replace `YOUR_VERCEL_LINK_HERE` with your actual Vercel deployment URL.

---

## Demo Preview

![Zorvyn Finance Dashboard Demo](./assets/Demo-Zorvyn-GIF.gif)

---

## Assignment Requirements Coverage

| Requirement | Status |
|---|---|
| Summary Cards | ✅ Done |
| Time-based visualization | ✅ Done |
| Categorical visualization | ✅ Done |
| Transactions with search/filter/sort | ✅ Done |
| Role-based UI (Admin/Viewer) | ✅ Done |
| Insights section | ✅ Done |
| State management | ✅ Done |
| Responsive design | ✅ Done |
| Empty state handling | ✅ Done |
| Dark mode + localStorage | ✅ Done |
| CSV Export | ✅ Done |
| Animations / transitions | ✅ Done |

**Bonus implemented:** Weekly Expense Tracker, custom toast notifications, floating add button for Admin mode.

---

## Project Structure

```text
finance-dashboard-zorvyn/
├── src/
│   ├── components/   # Layout, navbar, sidebar, modal, reusable UI primitives
│   ├── pages/        # Dashboard, Transactions, Analysis, NotFound
│   ├── store/        # Zustand store (transactions, filters, role, theme)
│   ├── lib/          # Formatting and utility helpers
│   ├── hooks/        # Custom hooks
│   └── test/         # Vitest setup and tests
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## What This Project Demonstrates

- UI design quality and visual hierarchy
- Component structure and reusability
- State management with Zustand
- Role-based UI simulation (Admin / Viewer)
- Responsive design across screen sizes
- Thoughtful interactions and polished frontend UX

---

## Note for Evaluators

This dashboard was built using **React + modern frontend tooling** to demonstrate component reusability, scalable architecture, and efficient state handling.

I am also comfortable building similar interfaces with vanilla JavaScript, CSS, and DOM APIs if required.

---

## Assumptions

- All data is mock/seeded for assignment demonstration.
- No backend or real authentication is implemented.
- Role switching is simulated entirely on the frontend.
- CSV export downloads the currently visible filtered transactions.
