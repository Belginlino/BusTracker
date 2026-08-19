import React from 'react';
import { WifiOff, SignalLow } from 'lucide-react';

export default function NetworkBanner({ isOnline, isLowBandwidth }) {
  if (isOnline && !isLowBandwidth) return null;

  return (
    <div className={`px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
      !isOnline ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>You are currently offline. Displaying cached last-known bus locations.</span>
        </>
      ) : (
        <>
          <SignalLow className="w-4 h-4" />
          <span>Low-bandwidth mode active. Reduced update frequency to conserve data.</span>
        </>
      )}
    </div>
  );
}
