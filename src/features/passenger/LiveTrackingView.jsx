import React, { useState, useEffect } from 'react';
import { Search, Filter, Bus, MapPin, Navigation, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import TransitMap from '../../components/map/TransitMap';
import BusDetailCard from './BusDetailCard';
import Badge from '../../components/common/Badge';
import { store } from '../../data/store';
import { calculateETA } from '../../services/tracking/etaCalculator';
import { formatTimeAgo, formatSpeed } from '../../utils/formatters';

export default function LiveTrackingView() {
  const [data, setData] = useState({
    buses: store.buses,
    routes: store.routes,
    stops: store.stops,
    locations: store.locations,
    alerts: store.alerts,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedBus, setSelectedBus] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.3118, lng: 76.6529, zoom: 13 });

  useEffect(() => {
    const unsubscribe = store.subscribe((updatedData) => {
      setData({ ...updatedData });
      // Keep selected bus reference updated with new GPS coordinates
      if (selectedBus) {
        const updatedBus = updatedData.buses.find(b => b.id === selectedBus.id);
        if (updatedBus) setSelectedBus(updatedBus);
      }
    });
    return () => unsubscribe();
  }, [selectedBus]);

  // Filter Buses
  const filteredBuses = data.buses.filter((bus) => {
    const route = data.routes.find(r => r.id === bus.routeId);
    const matchesSearch = 
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route && route.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route && route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRoute = selectedRouteFilter === 'all' || bus.routeId === selectedRouteFilter;
    const matchesStatus = selectedStatusFilter === 'all' || bus.status === selectedStatusFilter;

    return matchesSearch && matchesRoute && matchesStatus;
  });

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    const loc = data.locations[bus.id];
    if (loc && loc.latitude && loc.longitude) {
      setMapCenter({ lat: loc.latitude, lng: loc.longitude, zoom: 15 });
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      
      {/* Left Sidebar Control Panel */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20 shrink-0">
        
        {/* Search & Filter Top Bar */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-400" />
              Live Transit Fleet
            </h1>
            <span className="text-xs bg-brand-500/20 text-brand-300 font-semibold px-2 py-0.5 rounded border border-brand-500/30">
              {filteredBuses.length} Active Buses
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bus #, route, or stop..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 text-xs">
            <select
              value={selectedRouteFilter}
              onChange={(e) => setSelectedRouteFilter(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 py-1.5 px-2 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">All Routes</option>
              {data.routes.map(r => (
                <option key={r.id} value={r.id}>Route {r.routeNumber} — {r.startPoint.split(' ')[0]}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 py-1.5 px-2 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="on_time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="breakdown">Breakdown</option>
            </select>
          </div>
        </div>

        {/* Bus List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredBuses.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Bus className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No buses found matching query.
            </div>
          ) : (
            filteredBuses.map((bus) => {
              const loc = data.locations[bus.id];
              const route = data.routes.find(r => r.id === bus.routeId);
              const nextStop = data.stops.find(s => s.id === loc?.nextStopId);
              const etaInfo = calculateETA({ busLocation: loc, targetStop: nextStop });
              const isSelected = selectedBus?.id === bus.id;

              return (
                <div
                  key={bus.id}
                  onClick={() => handleSelectBus(bus)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{bus.busNumber}</span>
                        <Badge status={bus.status} />
                        {loc?.isDemo && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Route {route?.routeNumber} • {route?.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Next Stop</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {nextStop?.name || 'En route'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-medium block text-[11px]">ETA</span>
                      <span className="font-bold text-brand-600">
                        {etaInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Speed: {formatSpeed(loc?.speed)}</span>
                    <span>Updated {formatTimeAgo(loc?.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Live Map Display Area */}
      <div className="flex-1 relative h-full">
        <TransitMap
          buses={filteredBuses}
          locations={data.locations}
          routes={data.routes}
          stops={data.stops}
          selectedBusId={selectedBus?.id}
          selectedRouteId={selectedRouteFilter !== 'all' ? selectedRouteFilter : null}
          onSelectBus={handleSelectBus}
          center={mapCenter}
          zoom={mapCenter.zoom}
        />

        {/* Selected Bus Detail Card Overlay */}
        {selectedBus && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 shadow-2xl">
            <BusDetailCard
              bus={selectedBus}
              location={data.locations[selectedBus.id]}
              route={data.routes.find(r => r.id === selectedBus.routeId)}
              stops={data.stops}
              alerts={data.alerts.filter(a => a.routeId === selectedBus.routeId)}
              onClose={() => setSelectedBus(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
