import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bus, MapPin, Clock, Navigation, Bookmark, ChevronRight } from 'lucide-react';
import { store } from '../data/store';
import Badge from '../components/common/Badge';

export function RoutesPage() {
  const { routeId } = useParams();
  const [data, setData] = useState({
    routes: store.routes,
    buses: store.buses,
    stops: store.stops,
  });

  const [selectedRouteId, setSelectedRouteId] = useState(routeId || store.routes[0]?.id);

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => setData({ ...updated }));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (routeId) setSelectedRouteId(routeId);
  }, [routeId]);

  const activeRoute = data.routes.find(r => r.id === selectedRouteId) || data.routes[0];
  const routeBuses = data.buses.filter(b => b.routeId === activeRoute?.id);
  const routeStops = data.stops.filter(s => activeRoute?.stopIds?.includes(s.id));
  const isFav = store.isFavorite('route', activeRoute?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bus className="w-6 h-6 text-brand-600" />
          City Transit Routes
        </h1>
        <p className="text-xs text-slate-500 mt-1">Explore all official bus lines, ordered stops, and active vehicles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Route List */}
        <div className="space-y-3">
          {data.routes.map((route) => {
            const busCount = data.buses.filter(b => b.routeId === route.id).length;
            const isSelected = route.id === activeRoute?.id;

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700 border'
                    }`}>
                      {route.routeNumber}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{route.name}</div>
                      <div className={`text-xs ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                        {route.distanceKm} km • {busCount} active buses
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Route Timeline & Buses */}
        <div className="lg:col-span-2 space-y-6">
          {activeRoute && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-600 text-white font-extrabold px-2.5 py-0.5 rounded-lg text-xs">
                      Route {activeRoute.routeNumber}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{activeRoute.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Operating Hours: {activeRoute.operatingHours} • Total Distance: {activeRoute.distanceKm} km
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => store.toggleFavorite('route', activeRoute.id)}
                    className={`p-2 rounded-xl border ${
                      isFav ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <Link
                    to="/live"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Live Map View
                  </Link>
                </div>
              </div>

              {/* Active Buses Serving this Route */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Currently Assigned Buses ({routeBuses.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {routeBuses.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-brand-600" />
                        <span className="font-bold text-slate-900">{b.busNumber}</span>
                      </div>
                      <Badge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Stops List */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Route Stops Sequence ({routeStops.length} Stops)
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {routeStops.map((stop, idx) => (
                    <div key={stop.id} className="relative flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="absolute -left-6 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white"></div>
                      <div>
                        <div className="font-bold text-slate-900">{stop.name}</div>
                        <div className="text-[11px] text-slate-400">Stop #{idx + 1}</div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-1 rounded border">
                        {stop.routeIds.length} connected lines
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
