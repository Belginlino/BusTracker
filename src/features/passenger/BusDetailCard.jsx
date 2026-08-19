import React from 'react';
import { Bus, MapPin, Clock, Gauge, ShieldAlert, Bookmark, X, Navigation } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatTimeAgo, formatSpeed } from '../../utils/formatters';
import { calculateETA } from '../../services/tracking/etaCalculator';
import { store } from '../../data/store';

export default function BusDetailCard({ bus, location, route, stops = [], alerts = [], onClose }) {
  if (!bus) return null;

  const isFav = store.isFavorite('bus', bus.id);

  const routeStops = stops.filter(s => route?.stopIds?.includes(s.id));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[600px] w-full">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">{bus.busNumber}</h3>
                <Badge status={bus.status} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{route?.name || 'City Bus Line'}</p>
            </div>
          </div>
          
          <button
            onClick={() => store.toggleFavorite('bus', bus.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isFav ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isFav ? 'Remove Favorite' : 'Save Favorite'}
          >
            <Bookmark className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {location?.isDemo && (
          <div className="mt-3 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center justify-between">
            <span>⚡ DEMO SIMULATION VEHICLE</span>
            <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded uppercase">Live Track</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-3 text-center text-xs">
        <div className="border-r border-slate-200">
          <div className="text-slate-400 font-medium">Speed</div>
          <div className="font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
            <Gauge className="w-3.5 h-3.5 text-brand-600" />
            {formatSpeed(location?.speed)}
          </div>
        </div>
        <div className="border-r border-slate-200">
          <div className="text-slate-400 font-medium">Capacity</div>
          <div className="font-bold text-slate-900 mt-0.5">{bus.capacity} seats</div>
        </div>
        <div>
          <div className="text-slate-400 font-medium">Last Ping</div>
          <div className="font-semibold text-slate-700 mt-0.5">{formatTimeAgo(location?.timestamp)}</div>
        </div>
      </div>

      {/* Relevant Alerts */}
      {alerts.length > 0 && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 space-y-1">
          {alerts.map(a => (
            <div key={a.id} className="flex items-start gap-2 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{a.title}: </span>
                <span>{a.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Route Timeline with Live ETA per upcoming stop */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5" />
          Route Stops & Real-Time ETA
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {routeStops.map((stop, idx) => {
            const isNext = location?.nextStopId === stop.id;
            const eta = calculateETA({ busLocation: location, targetStop: stop });

            return (
              <div key={stop.id} className="relative flex items-center justify-between text-xs">
                {/* Node indicator */}
                <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isNext ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-400'
                }`}></div>

                <div>
                  <div className={`font-semibold ${isNext ? 'text-brand-600 font-bold' : 'text-slate-800'}`}>
                    {stop.name}
                  </div>
                  <div className="text-[11px] text-slate-400">Stop #{idx + 1}</div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    isNext ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {eta.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
