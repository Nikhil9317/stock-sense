import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Building2, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, setActiveTab }) => {
  const { 
    currentUser, 
    logout, 
    switchRole, 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    resetDemoData 
  } = useInventory();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 shadow-sm border-b border-slate-300">
      {/* Top Banner - Official Government Identity Bar */}
      <div className="gov-header-bg text-white px-4 py-2 flex items-center justify-between text-xs font-sans border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200 uppercase tracking-wide text-[11px]">Gov Official Portal</span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="text-slate-200 font-medium hidden md:inline">
            Directorate of Inventory Management & Stock Logistics (IMS-Portal)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Team Name Badge */}
          <div className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
            <span>Team: Nikhil9317</span>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset Demo Data"
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-600 transition"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation & Identity Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-xl rounded border border-blue-950 shadow-sm">
            <Building2 className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none font-serif">
                StockSense
              </h1>
              <span className="bg-blue-100 text-blue-900 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-300 uppercase">
                Enterprise IMS v2.6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Centralized National Stock & Operational Ledger System
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher Pill */}
          {currentUser && (
            <div className="hidden lg:flex items-center bg-slate-100 border border-slate-300 rounded p-0.5">
              <button
                onClick={() => switchRole('manager')}
                className={`px-3 py-1 text-xs font-bold rounded transition ${
                  currentUser.role === 'manager'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inventory Manager
              </button>
              <button
                onClick={() => switchRole('staff')}
                className={`px-3 py-1 text-xs font-bold rounded transition ${
                  currentUser.role === 'staff'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Warehouse Staff
              </button>
            </div>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded border border-slate-300 relative transition"
              title="System Alerts & Low Stock Notices"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-2xl border border-slate-300 z-50">
                <div className="gov-header-bg text-white px-4 py-2.5 rounded-t-md flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm">System Alerts & Notifications</span>
                  </div>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs font-medium">
                      No active alerts or stock warnings.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs rounded transition cursor-pointer ${
                          n.isRead ? 'bg-white opacity-70' : 'bg-blue-50/60 font-medium'
                        } hover:bg-slate-50`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            {n.type === 'low_stock' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                            <span>{n.title}</span>
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1 pl-5 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <div className="mt-1.5 pl-5 text-[10px] text-slate-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 text-right">
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-bold text-blue-900 hover:underline"
                    >
                      Clear All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Account / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role === 'manager' ? 'Inventory Manager' : 'Warehouse Staff'}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-slate-300 z-50 py-1">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
                    <div className="mt-1 flex items-center space-x-1 text-[10px] font-semibold text-blue-900 uppercase">
                      <ShieldCheck className="w-3 h-3 text-blue-900" />
                      <span>{currentUser.department}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2 font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>My Official Profile</span>
                  </button>

                  <div className="px-4 py-2 border-t border-slate-200 bg-slate-50/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Role Toggle
                    </p>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          switchRole('manager');
                          setShowUserMenu(false);
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded border ${
                          currentUser.role === 'manager'
                            ? 'bg-blue-900 text-white border-blue-950'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Manager
                      </button>
                      <button
                        onClick={() => {
                          switchRole('staff');
                          setShowUserMenu(false);
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded border ${
                          currentUser.role === 'staff'
                            ? 'bg-blue-900 text-white border-blue-950'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Staff
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-700 hover:bg-red-50 flex items-center space-x-2 font-bold border-t border-slate-200"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="gov-btn-primary px-4 py-1.5 rounded text-xs uppercase tracking-wide flex items-center space-x-1.5 shadow-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / OTP Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
