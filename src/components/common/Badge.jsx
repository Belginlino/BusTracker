import React from 'react';
import { BUS_STATUS } from '../../utils/constants';

export default function Badge({ status, label, className = '' }) {
  const getBadgeStyle = () => {
    switch (status) {
      case BUS_STATUS.ON_TIME:
      case 'on_time':
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case BUS_STATUS.DELAYED:
      case 'delayed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case BUS_STATUS.BREAKDOWN:
      case 'breakdown':
      case 'emergency':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'demo':
      case 'simulation':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      case BUS_STATUS.INACTIVE:
      case 'inactive':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label || status?.replace('_', ' ').toUpperCase()}
    </span>
  );
}
