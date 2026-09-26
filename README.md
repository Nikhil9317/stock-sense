# StockSense - Inventory Management System (IMS)

**Team Name**: `Nikhil9317`  
**GitHub Repository**: [Nikhil9317/stock-sense](https://github.com/Nikhil9317/stock-sense)  
**Live Application**: [http://localhost:5173/](http://localhost:5173/)

StockSense is a modular, high-performance Inventory Management System built to replace manual registers, spreadsheets, and scattered tracking methods with a centralized, real-time, official government-styled web application.

---

## 🏛️ Key Features & Architecture

### 1. Official White Government Web Portal Design System
- High-contrast, clean white/light grey UI (`#ffffff` / `#f8fafc`) with navy blue headers (`#0f2942`, `#1e3a8a`).
- Official Directorate identity crest, Team **Nikhil9317** badge, sharp structural tables, clean badges, and zero generic AI gradients.

### 2. Authentication & Role Permissions
- Support for **Inventory Manager** and **Warehouse Staff** roles.
- Interactive OTP-based password reset simulation (Demo OTP: `9317`).
- Role permission matrix and live switcher.

### 3. Dashboard View & Dynamic Filters
- **Snapshot KPIs**: Total Stock Quantity, Low Stock Alerts, Pending Receipts, Pending Deliveries, Scheduled Internal Transfers.
- **Dynamic Filters**: Filter by Document Type (`Receipts`, `Deliveries`, `Internal`, `Adjustments`), Status (`Draft`, `Waiting`, `Ready`, `Done`, `Canceled`), Warehouse Location, and SKU Keyword Search.

### 4. Products & Reordering Rules
- Product SKU creation and categorization (`Raw Materials`, `Finished Goods`, `Components & Spares`, `Packaging`, `Chemicals`, `Hardware`).
- Low-stock alert badges whenever total stock falls below threshold.
- Per-location stock breakdown drawer for every item.

### 5. Core Operational Workflows
- **Receipts (Incoming Goods)**: Vendor intake process -> Auto-increases product total & location stock.
- **Delivery Orders (Outgoing Goods)**: Customer shipment picking & packing -> Checks stock availability and decrements inventory.
- **Internal Transfers**: Move stock between facilities (e.g. *Main Store → Production Floor*).
- **Stock Adjustments**: Reconcile physical count mismatches with automatic write-off audit entries.

### 6. Move History & Compliance Audit Ledger
- Immutable audit log of all inventory transactions (`+ IN`, `- OUT`, `TRANSFER`, `ADJUSTMENT`) with timestamp, operator name, role, and remarks.
- Single-click **CSV Export** (`StockSense_Ledger_Export.csv`) and **Print Audit Report**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ One-Click Vercel Deployment

This project includes a pre-configured [`vercel.json`](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/stocksense_app/vercel.json) file.

To deploy instantly to Vercel:
```bash
npx vercel --prod
```
Or import [Nikhil9317/stock-sense](https://github.com/Nikhil9317/stock-sense) directly at [vercel.com/new](https://vercel.com/new).
