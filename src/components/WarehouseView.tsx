import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Building2, MapPin, Layers } from 'lucide-react';

export const WarehouseView: React.FC = () => {
  const { locations, products } = useInventory();

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Infrastructure Setup
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Multi-Warehouse & Storage Location Setup
          </h2>
          <p className="text-xs text-slate-600">
            Manage central depots, regional distribution hubs, production assembly floors, and binning racks.
          </p>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => {
          // Calculate stock items stored at this location
          const itemsAtLoc = products.filter((p) => (p.stockByLocation[loc.id] || 0) > 0);
          const totalUnitsAtLoc = products.reduce((acc, p) => acc + (p.stockByLocation[loc.id] || 0), 0);
          const occupancyPct = Math.min(100, Math.round((totalUnitsAtLoc / loc.capacityLimit) * 100));

          return (
            <div key={loc.id} className="gov-card p-4 rounded-md space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono border border-blue-200">
                    {loc.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1 font-serif">
                    {loc.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{loc.warehouseName}</span>
                  </div>
                </div>
                <Building2 className="w-6 h-6 text-blue-900 shrink-0" />
              </div>

              {/* Occupancy Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Storage Occupancy</span>
                  <span className={occupancyPct > 85 ? 'text-red-700' : 'text-blue-900'}>
                    {occupancyPct}% ({totalUnitsAtLoc.toLocaleString()} / {loc.capacityLimit.toLocaleString()} Units)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancyPct > 85 ? 'bg-red-600' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-blue-900'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Products Stored */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Stored Product Line Items ({itemsAtLoc.length})</span>
                  <Layers className="w-3 h-3 text-slate-400" />
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {itemsAtLoc.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic">No products currently at location.</div>
                  ) : (
                    itemsAtLoc.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="font-semibold text-slate-800 truncate max-w-[160px]">{p.name}</span>
                        <span className="font-mono font-bold text-blue-900">
                          {p.stockByLocation[loc.id]} {p.unitOfMeasure}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
