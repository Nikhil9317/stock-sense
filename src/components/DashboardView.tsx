import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Package, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Filter, 
  FileText, 
  Layers, 
  Building
} from 'lucide-react';
import type { OperationType, OperationStatus } from '../types/inventory';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  setOperationFilter: (op: string) => void;
  onOpenCreateOpModal: (type: OperationType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  setOperationFilter,
  onOpenCreateOpModal,
}) => {
  const { products, operations, locations, filters, setFilters, validateOperation } = useInventory();

  // KPI Calculations
  const totalProducts = products.length;
  const totalStockQuantity = products.reduce((acc, p) => acc + p.totalStock, 0);
  const lowStockItems = products.filter((p) => p.totalStock <= p.minStockLevel);
  const outOfStockItems = products.filter((p) => p.totalStock === 0);

  const pendingReceipts = operations.filter((o) => o.type === 'receipt' && (o.status === 'waiting' || o.status === 'ready')).length;
  const pendingDeliveries = operations.filter((o) => o.type === 'delivery' && (o.status === 'waiting' || o.status === 'ready')).length;
  const scheduledTransfers = operations.filter((o) => o.type === 'internal' && (o.status === 'waiting' || o.status === 'ready' || o.status === 'draft')).length;

  // Filtered operations list based on dynamic filters
  const filteredOperations = operations.filter((op) => {
    if (filters.documentType !== 'all' && op.type !== filters.documentType) return false;
    if (filters.status !== 'all' && op.status !== filters.status) return false;
    if (filters.warehouse !== 'all' && op.sourceLocation !== filters.warehouse && op.destinationLocation !== filters.warehouse) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchCode = op.code.toLowerCase().includes(q);
      const matchPartner = op.partnerName?.toLowerCase().includes(q);
      const matchItems = op.items.some((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
      if (!matchCode && !matchPartner && !matchItems) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case 'done':
        return <span className="gov-badge-success text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Done</span>;
      case 'ready':
        return <span className="gov-badge-info text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Ready</span>;
      case 'waiting':
        return <span className="gov-badge-warning text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Waiting</span>;
      case 'draft':
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-slate-300">Draft</span>;
      case 'canceled':
        return <span className="gov-badge-danger text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Canceled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Government Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Operational Snapshot
            </span>
            <span className="text-xs font-mono text-slate-500">System Time: {new Date().toLocaleDateString()}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Central Inventory Dashboard
          </h2>
          <p className="text-xs text-slate-600">
            Real-time stock monitoring, incoming vendor receipts, outgoing dispatches, and location transfers.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenCreateOpModal('receipt')}
            className="gov-btn-primary px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>+ New Receipt</span>
          </button>
          <button
            onClick={() => onOpenCreateOpModal('delivery')}
            className="bg-sky-800 hover:bg-sky-700 text-white font-semibold px-3 py-1.5 rounded text-xs border border-sky-900 flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-sky-200" />
            <span>+ New Delivery</span>
          </button>
          <button
            onClick={() => onOpenCreateOpModal('internal')}
            className="bg-purple-900 hover:bg-purple-800 text-white font-semibold px-3 py-1.5 rounded text-xs border border-purple-950 flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-200" />
            <span>+ New Transfer</span>
          </button>
        </div>
      </div>

      {/* Dashboard KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Products */}
        <div className="gov-card p-4 rounded-md relative overflow-hidden border-t-4 border-t-blue-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Products in Stock
            </span>
            <Package className="w-5 h-5 text-blue-900" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs font-normal text-slate-500">Items</span></div>
            <div className="text-[11px] font-semibold text-slate-600 font-mono">
              {totalStockQuantity.toLocaleString()} Units Total
            </div>
          </div>
          <div className="mt-2 text-[10px] text-blue-900 font-bold underline cursor-pointer" onClick={() => setActiveTab('products')}>
            View Product Catalog →
          </div>
        </div>

        {/* KPI 2: Low Stock / Out of Stock */}
        <div className="gov-card p-4 rounded-md relative overflow-hidden border-t-4 border-t-red-600 bg-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wide">
              Low / Out of Stock
            </span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-red-700">{lowStockItems.length}</div>
            <div className="text-[11px] font-bold text-red-900">
              {outOfStockItems.length} Zero Stock
            </div>
          </div>
          <div className="mt-2 text-[10px] text-red-700 font-bold underline cursor-pointer" onClick={() => setActiveTab('products')}>
            Review Threshold Alerts →
          </div>
        </div>

        {/* KPI 3: Pending Receipts */}
        <div className="gov-card p-4 rounded-md relative overflow-hidden border-t-4 border-t-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Pending Receipts
            </span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{pendingReceipts}</div>
            <div className="text-[11px] font-semibold text-emerald-800">
              Vendor Dock Intake
            </div>
          </div>
          <div className="mt-2 text-[10px] text-emerald-800 font-bold underline cursor-pointer" onClick={() => { setActiveTab('operations'); setOperationFilter('receipt'); }}>
            Process Incoming Goods →
          </div>
        </div>

        {/* KPI 4: Pending Deliveries */}
        <div className="gov-card p-4 rounded-md relative overflow-hidden border-t-4 border-t-sky-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
              Pending Deliveries
            </span>
            <ArrowUpRight className="w-5 h-5 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{pendingDeliveries}</div>
            <div className="text-[11px] font-semibold text-sky-800">
              Outgoing Orders
            </div>
          </div>
          <div className="mt-2 text-[10px] text-sky-800 font-bold underline cursor-pointer" onClick={() => { setActiveTab('operations'); setOperationFilter('delivery'); }}>
            Pick & Pack Shipment →
          </div>
        </div>

        {/* KPI 5: Internal Transfers */}
        <div className="gov-card p-4 rounded-md relative overflow-hidden border-t-4 border-t-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
              Scheduled Transfers
            </span>
            <RefreshCw className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{scheduledTransfers}</div>
            <div className="text-[11px] font-semibold text-purple-800">
              Inter-location Moves
            </div>
          </div>
          <div className="mt-2 text-[10px] text-purple-800 font-bold underline cursor-pointer" onClick={() => { setActiveTab('operations'); setOperationFilter('internal'); }}>
            Track Movements →
          </div>
        </div>
      </div>

      {/* Dynamic Filter Toolbar */}
      <div className="gov-card p-4 rounded-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Dynamic Operation Filters
            </h3>
          </div>
          <button
            onClick={() =>
              setFilters({
                documentType: 'all',
                status: 'all',
                warehouse: 'all',
                category: 'all',
                searchQuery: '',
              })
            }
            className="text-[11px] font-bold text-slate-600 hover:text-blue-900 underline"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Document Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <FileText className="w-3 h-3 text-slate-500" />
              <span>By Document Type</span>
            </label>
            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value as any })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:bg-white focus:border-blue-800"
            >
              <option value="all">All Operations (Receipts, Deliveries, Transfers, Adjustments)</option>
              <option value="receipt">Receipts (Incoming Goods)</option>
              <option value="delivery">Delivery Orders (Outgoing Shipment)</option>
              <option value="internal">Internal Transfers (Location Move)</option>
              <option value="adjustment">Stock Adjustments (Audit Mismatch)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-slate-500" />
              <span>By Status</span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:bg-white focus:border-blue-800"
            >
              <option value="all">All Statuses (Draft, Waiting, Ready, Done, Canceled)</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting (Pending Verification)</option>
              <option value="ready">Ready (Approved for Execution)</option>
              <option value="done">Done (Validated & Executed)</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Warehouse Location Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Building className="w-3 h-3 text-slate-500" />
              <span>By Warehouse / Location</span>
            </label>
            <select
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:bg-white focus:border-blue-800"
            >
              <option value="all">All Locations & Facilities</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Keyword Search (Code, Partner, SKU)
            </label>
            <input
              type="text"
              placeholder="Search REC-2026, Steel, Apex..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:bg-white focus:border-blue-800"
            />
          </div>
        </div>
      </div>

      {/* Main Operations List Table */}
      <div className="gov-card rounded-md overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">
              Operational Register ({filteredOperations.length} Records)
            </h3>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Showing filtered operation records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="gov-table-header">
                <th className="py-2.5 px-4">Ref Code</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Source / Destination</th>
                <th className="py-2.5 px-4">Items / Qty</th>
                <th className="py-2.5 px-4">Scheduled Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
              {filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No matching inventory operations found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredOperations.map((op) => {
                  const srcLoc = locations.find((l) => l.id === op.sourceLocation)?.name || op.sourceLocation;
                  const destLoc = locations.find((l) => l.id === op.destinationLocation)?.name || op.destinationLocation;

                  return (
                    <tr key={op.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {op.code}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold">
                        <span className="flex items-center space-x-1">
                          {op.type === 'receipt' && <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />}
                          {op.type === 'delivery' && <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />}
                          {op.type === 'internal' && <RefreshCw className="w-3.5 h-3.5 text-purple-600" />}
                          <span>{op.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold">{srcLoc}</div>
                        <div className="text-[11px] text-slate-500">→ {destLoc}</div>
                      </td>
                      <td className="py-3 px-4">
                        {op.items.map((item, idx) => (
                          <div key={idx} className="font-semibold text-slate-900">
                            {item.quantity} {item.unitOfMeasure} × {item.productName}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{op.scheduledDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(op.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {op.status !== 'done' && op.status !== 'canceled' ? (
                          <button
                            onClick={() => {
                              const res = validateOperation(op.id);
                              alert(res.message);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-sm transition"
                          >
                            Validate & Intake
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
