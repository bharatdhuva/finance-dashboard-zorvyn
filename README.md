# Zorvyn Finance Dashboard

A role-based finance dashboard built for internal reporting and clean handoff demos.

## What this project includes

- Financial overview with balance trend and expense composition
- Transaction ledger with search, sorting, editing, and CSV export
- Analysis view for month-over-month spending and top categories
- Admin and viewer modes for controlled access behavior

## Tech stack

- React + Vite
- Zustand for persisted local state
- Tailwind CSS + reusable UI primitives
- Recharts for interactive visualizations

## Run locally

```bash
npm install
npm run dev
```

## Build and test

```bash
npm run build
npm run test
```

## Notes

- Data is seeded with mock records and persisted in browser storage.
- UI is tuned for both desktop and mobile layouts.
