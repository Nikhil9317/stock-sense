import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  History, 
  Download, 
  Printer, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  SlidersHorizontal 
} from 'lucide-react';

export const MoveHistoryView: React.FC = () => {
  const { moveLedger, exportLedgerCSV } = useInventory();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLedger = moveLedger.filter((entry) => {
    if (typeFilter !== 'all' && entry.movementType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchProd = entry.productName.toLowerCase().includes(q);
      const matchSku = entry.sku.toLowerCase().includes(q);
      const matchRef = entry.referenceCode.toLowerCase().includes(q);
      const matchOp = entry.operatorName.toLowerCase().includes(q);
      if (!matchProd && !matchSku && !matchRef && !matchOp) return false;
    }
    return true;
  });

  const getMovementBadge = (type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT') => {
    switch (type) {
      case 'IN':
        return (
          <span className="gov-badge-success text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
            <ArrowDownLeft className="w-3 h-3 text-emerald-700" />
            <span>+ IN</span>
          </span>
        );
      case 'OUT':
        return (
          <span className="gov-badge-danger text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
            <ArrowUpRight className="w-3 h-3 text-red-700" />
            <span>- OUT</span>
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="gov-badge-info text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
            <RefreshCw className="w-3 h-3 text-blue-700" />
            <span>TRANSFER</span>
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="gov-badge-warning text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
            <SlidersHorizontal className="w-3 h-3 text-amber-700" />
            <span>ADJUSTMENT</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Audit & Compliance Register
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Stock Move History & Audit Ledger
          </h2>
          <p className="text-xs text-slate-600">
            Immutable log of all physical stock receipts, customer shipments, inter-warehouse movements, and write-offs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="gov-btn-secondary px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Audit Report</span>
          </button>
          <button
            onClick={exportLedgerCSV}
            className="gov-btn-primary px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gov-card p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Reference, SKU, Product, Operator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-medium focus:bg-white focus:border-blue-900"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Movement Type:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 font-semibold text-slate-800 focus:bg-white"
          >
            <option value="all">All Movements ({moveLedger.length} Records)</option>
            <option value="IN">IN (Vendor Receipts)</option>
            <option value="OUT">OUT (Customer Shipments)</option>
            <option value="TRANSFER">TRANSFER (Internal Relocations)</option>
            <option value="ADJUSTMENT">ADJUSTMENT (Audit Corrections)</option>
          </select>
        </div>
      </div>

      {/* Move History Table */}
      <div className="gov-card rounded-md overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">
              Ledger Transactions ({filteredLedger.length} Records)
            </h3>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Official Audit Trail
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="gov-table-header">
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Ref Code</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Product Name & SKU</th>
                <th className="py-2.5 px-4">Quantity</th>
                <th className="py-2.5 px-4">From → To Location</th>
                <th className="py-2.5 px-4">Operator / Role</th>
                <th className="py-2.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    No ledger records match the selected search query.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {entry.referenceCode}
                    </td>
                    <td className="py-3 px-4">{getMovementBadge(entry.movementType)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{entry.productName}</div>
                      <div className="text-[10px] font-mono text-slate-500">SKU: {entry.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {entry.movementType === 'IN' ? '+' : entry.movementType === 'OUT' ? '-' : ''}
                      {entry.quantity} {entry.unitOfMeasure}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{entry.sourceLocation}</div>
                      <div className="text-[11px] text-slate-500">→ {entry.destinationLocation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{entry.operatorName}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{entry.operatorRole}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {entry.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
