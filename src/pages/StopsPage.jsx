import React, { useState, useEffect } from 'react';
import { MapPin, Search, Bus, Bookmark, Navigation } from 'lucide-react';
import { store } from '../data/store';
import { Link } from 'react-router-dom';

export function StopsPage() {
  const [data, setData] = useState({
    stops: store.stops,
    routes: store.routes,
    buses: store.buses,
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => setData({ ...updated }));
    return () => unsubscribe();
  }, []);

  const filteredStops = data.stops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-600" />
            Bus Stop Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Official city bus stops & connected routes</p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stop by name..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStops.map((stop) => {
          const isFav = store.isFavorite('stop', stop.id);
          const connectedRoutes = data.routes.filter(r => stop.routeIds?.includes(r.id));

          return (
            <div key={stop.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{stop.name}</h3>
                    <p className="text-[11px] text-slate-400">Lat: {stop.latitude.toFixed(4)}, Lng: {stop.longitude.toFixed(4)}</p>
                  </div>
                </div>

                <button
                  onClick={() => store.toggleFavorite('stop', stop.id)}
                  className={`p-1.5 rounded-lg border ${
                    isFav ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Serving Routes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {connectedRoutes.map(r => (
                    <Link
                      key={r.id}
                      to={`/routes/${r.id}`}
                      className="bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded border border-brand-200"
                    >
                      Route {r.routeNumber}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
