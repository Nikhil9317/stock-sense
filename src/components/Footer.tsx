import React from 'react';
import { ShieldCheck, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs py-4 px-6 border-t border-slate-800 no-print font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-sm font-serif">StockSense IMS Portal</div>
            <div className="text-[11px] text-slate-400">
              National Stock Management & Inventory Logistics Infrastructure
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px] font-medium text-slate-400">
          <span>Official Portal Guidelines</span>
          <span>•</span>
          <span>Accessibility Compliance</span>
          <span>•</span>
          <div className="bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Built by Team Nikhil9317</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
