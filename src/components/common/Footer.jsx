import React from 'react';
import { Bus, ShieldAlert, Heart, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-slate-200">TransitPulse</span>
          <span className="text-slate-500">— Tier-2 City Transport MVP</span>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Live Firestore Listener Active
          </span>
          <span>•</span>
          <span>Low-Bandwidth Optimized</span>
        </div>

        <div className="text-slate-500">
          Built for Hackathon Demo & Real-World Transit Systems
        </div>
      </div>
    </footer>
  );
}
