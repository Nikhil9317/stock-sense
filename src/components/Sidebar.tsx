import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  SlidersHorizontal, 
  History, 
  Warehouse, 
  User as UserIcon,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  operationFilter?: string;
  setOperationFilter?: (op: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  operationFilter = 'all',
  setOperationFilter,
}) => {
  const { currentUser, operations } = useInventory();

  // Pending counts for badges
  const pendingReceipts = operations.filter((o) => o.type === 'receipt' && (o.status === 'waiting' || o.status === 'ready')).length;
  const pendingDeliveries = operations.filter((o) => o.type === 'delivery' && (o.status === 'waiting' || o.status === 'ready')).length;

  const handleOpClick = (opType: string) => {
    setActiveTab('operations');
    if (setOperationFilter) {
      setOperationFilter(opType);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-85px)] border-r border-slate-800 flex flex-col justify-between shrink-0 font-sans no-print">
      <div className="py-4">
        {/* Navigation Category Label */}
        <div className="px-4 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Core Navigation Portal
        </div>

        <nav className="space-y-1 px-2">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'dashboard'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Dashboard</span>
            </div>
            {activeTab === 'dashboard' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Products */}
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'products'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Products Catalog</span>
            </div>
            {activeTab === 'products' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Operations Sub-Group */}
          <div className="pt-2 pb-1">
            <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <ClipboardList className="w-3 h-3 text-slate-400" />
              <span>Stock Operations</span>
            </div>

            <div className="space-y-0.5 pl-2">
              <button
                onClick={() => handleOpClick('all')}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition ${
                  activeTab === 'operations' && operationFilter === 'all'
                    ? 'bg-slate-800 text-blue-300 font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>All Operations</span>
              </button>

              <button
                onClick={() => handleOpClick('receipt')}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition ${
                  activeTab === 'operations' && operationFilter === 'receipt'
                    ? 'bg-slate-800 text-blue-300 font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Receipts (Incoming)</span>
                </div>
                {pendingReceipts > 0 && (
                  <span className="bg-emerald-900 text-emerald-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                    {pendingReceipts}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleOpClick('delivery')}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition ${
                  activeTab === 'operations' && operationFilter === 'delivery'
                    ? 'bg-slate-800 text-blue-300 font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                  <span>2. Delivery Orders</span>
                </div>
                {pendingDeliveries > 0 && (
                  <span className="bg-sky-900 text-sky-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                    {pendingDeliveries}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleOpClick('internal')}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition ${
                  activeTab === 'operations' && operationFilter === 'internal'
                    ? 'bg-slate-800 text-blue-300 font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Internal Transfers</span>
                </div>
              </button>

              <button
                onClick={() => handleOpClick('adjustment')}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition ${
                  activeTab === 'operations' && operationFilter === 'adjustment'
                    ? 'bg-slate-800 text-blue-300 font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Stock Adjustments</span>
                </div>
              </button>
            </div>
          </div>

          {/* Move History */}
          <button
            onClick={() => setActiveTab('ledger')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'ledger'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <History className="w-4 h-4 text-purple-400" />
              <span>Move History / Ledger</span>
            </div>
            {activeTab === 'ledger' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Warehouse Settings */}
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'warehouses'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Warehouse className="w-4 h-4 text-indigo-400" />
              <span>Warehouse Setup</span>
            </div>
            {activeTab === 'warehouses' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'profile'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </div>
            {activeTab === 'profile' && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800">
        <div className="text-[11px] font-medium text-slate-400">Logged in user:</div>
        <div className="text-xs font-bold text-amber-300 truncate">
          {currentUser ? currentUser.name : 'Guest User'}
        </div>
        <div className="text-[10px] text-slate-400 capitalize mt-0.5">
          Role: <span className="font-semibold text-slate-200">{currentUser?.role || 'Guest'}</span>
        </div>
      </div>
    </aside>
  );
};
