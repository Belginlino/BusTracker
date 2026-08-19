import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Search, Navigation, MapPin, ShieldAlert, ArrowRight, Radio, Bookmark, Clock, Zap } from 'lucide-react';
import { store } from '../data/store';
import Badge from '../components/common/Badge';

export function HomePage() {
  const [data, setData] = useState({
    buses: store.buses,
    routes: store.routes,
    stops: store.stops,
    alerts: store.alerts,
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => setData({ ...updated }));
    return () => unsubscribe();
  }, []);

  const activeAlerts = data.alerts.filter(a => a.active);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      
      {/* Hero Banner Section */}
      <section className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 to-slate-900/90 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-xs font-semibold border border-brand-500/30">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Real-Time GPS Transit Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Know Where Your Bus Is. <br />
            <span className="text-brand-400">Before You Wait.</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-normal">
            Live public transport tracking for tier-2 towns and small cities. Real-time GPS coordinates, transparent ETAs, and instant service alerts.
          </p>

          {/* Quick Search & Action Buttons */}
          <div className="max-w-xl mx-auto pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Link
                to="/live"
                className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4" />
                Track Live Buses
              </Link>
              <Link
                to="/routes"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-6 rounded-2xl border border-slate-700 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Bus className="w-4 h-4 text-emerald-400" />
                Explore Routes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Service Alerts Carousel/Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Active City Transit Alerts ({activeAlerts.length})
              </div>
              <span className="text-xs text-amber-600 font-medium">Updated live</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{alert.title}</div>
                  <p className="text-slate-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Routes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Popular City Bus Routes</h2>
              <p className="text-xs text-slate-500">Major transit corridors with frequent service</p>
            </div>
            <Link to="/routes" className="text-brand-600 hover:text-brand-700 font-semibold text-xs flex items-center gap-1">
              View all 5 routes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.routes.slice(0, 3).map(route => {
              const routeBuses = data.buses.filter(b => b.routeId === route.id);
              return (
                <Link
                  key={route.id}
                  to={`/routes/${route.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-black text-sm flex items-center justify-center border border-brand-200">
                      {route.routeNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {routeBuses.length} active buses
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                    {route.name}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{route.distanceKm} km • ~{route.estimatedDurationMin} mins</span>
                    <span className="font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View Live Map →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Real-Time GPS Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Driver coordinates sync to Firestore and passenger maps in real time without refreshing the page.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Transparent ETAs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates arrival times dynamically using current GPS speed, next stop distance, and traffic delay alerts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Low-Bandwidth Mode</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimized write frequencies, cached last-known positions, and clear stale-data timestamps for poor mobile networks.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
