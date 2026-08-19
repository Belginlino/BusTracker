import React from 'react';

export default function Loading({ text = 'Loading transit data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-brand-600 font-bold text-xs">
          🚌
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse">{text}</p>
    </div>
  );
}
