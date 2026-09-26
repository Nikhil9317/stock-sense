import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShieldCheck, CheckCircle, Lock } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, switchRole } = useInventory();

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            User Account Settings
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
          Official User Profile & Access Control
        </h2>
        <p className="text-xs text-slate-600">
          Role-based operational permissions, authorization credentials, and officer details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="gov-card p-5 rounded-md space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-blue-900 text-amber-300 font-bold text-2xl flex items-center justify-center border-2 border-amber-400 shadow">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg font-serif">{currentUser.name}</h3>
              <div className="text-xs text-slate-500 font-mono">{currentUser.email}</div>
              <div className="mt-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded w-fit border border-amber-300 uppercase">
                {currentUser.badgeNumber}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Assigned Department:</span>
              <span className="font-semibold text-slate-900 text-right">{currentUser.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Current Role:</span>
              <span className="font-bold text-blue-900 uppercase">{currentUser.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Default Facility:</span>
              <span className="font-semibold text-slate-900">Main Central Depot</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Quick Role Switcher (Demo Mode)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchRole('manager')}
                className={`py-2 px-3 text-xs font-bold rounded border transition ${
                  currentUser.role === 'manager'
                    ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Inventory Manager
              </button>
              <button
                onClick={() => switchRole('staff')}
                className={`py-2 px-3 text-xs font-bold rounded border transition ${
                  currentUser.role === 'staff'
                    ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Warehouse Staff
              </button>
            </div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-2 gov-card p-5 rounded-md space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center space-x-2 border-b border-slate-200 pb-2">
            <ShieldCheck className="w-4 h-4 text-blue-900" />
            <span>Role Permission Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="gov-table-header">
                  <th className="p-2.5">System Action / Feature</th>
                  <th className="p-2.5">Inventory Manager</th>
                  <th className="p-2.5">Warehouse Staff</th>
                  <th className="p-2.5">Your Active Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr>
                  <td className="p-2.5 font-bold">View Inventory Dashboard & KPIs</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5"><CheckCircle className="w-4 h-4 text-emerald-600" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Create / Edit / Delete Products</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-amber-700 font-bold">Read Only</td>
                  <td className="p-2.5">{currentUser.role === 'manager' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Create Operational Documents (Receipts/Deliveries)</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5"><CheckCircle className="w-4 h-4 text-emerald-600" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Validate & Execute Stock Receipts / Dispatches</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5"><CheckCircle className="w-4 h-4 text-emerald-600" /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Perform Physical Stock Adjustments & Write-Offs</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-amber-700 font-bold">Requires Approval</td>
                  <td className="p-2.5">{currentUser.role === 'manager' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Export Audit CSV & Print Official Ledger Reports</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Full Access</td>
                  <td className="p-2.5"><CheckCircle className="w-4 h-4 text-emerald-600" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
