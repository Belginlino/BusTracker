import React, { useState, useEffect } from 'react';
import { Bookmark, Bus, MapPin, Navigation, Trash2 } from 'lucide-react';
import { store } from '../data/store';
import { Link } from 'react-router-dom';

export function FavoritesPage() {
  const [favorites, setFavorites] = useState(store.favorites);
  const [data, setData] = useState({
    buses: store.buses,
    routes: store.routes,
    stops: store.stops,
  });

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => {
      setFavorites([...updated.favorites]);
      setData({ ...updated });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
          My Saved Transit Favorites
        </h1>
        <p className="text-xs text-slate-500 mt-1">Quick access to your frequently used buses, routes, and stops</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Saved Favorites</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any bus, route, or stop to quickly pin it here.
          </p>
          <Link
            to="/live"
            className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
          >
            <Navigation className="w-3.5 h-3.5" />
            Explore Live Buses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav, i) => {
            if (fav.type === 'bus') {
              const item = data.buses.find(b => b.id === fav.targetId);
              if (!item) return null;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.busNumber}</div>
                      <div className="text-xs text-slate-500">{item.vehicleType}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => store.toggleFavorite('bus', item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            if (fav.type === 'route') {
              const item = data.routes.find(r => r.id === fav.targetId);
              if (!item) return null;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      {item.routeNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.distanceKm} km</div>
                    </div>
                  </div>
                  <button
                    onClick={() => store.toggleFavorite('route', item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            if (fav.type === 'stop') {
              const item = data.stops.find(s => s.id === fav.targetId);
              if (!item) return null;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.routeIds?.length} connecting routes</div>
                    </div>
                  </div>
                  <button
                    onClick={() => store.toggleFavorite('stop', item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
