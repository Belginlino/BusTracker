import React, { useState, useEffect } from 'react';
import { Shield, Bus, MapPin, Navigation, Play, Pause, Square, RotateCcw, Plus, AlertTriangle, Users, Calendar, Radio } from 'lucide-react';
import { store } from '../../data/store';
import { simulatorService } from '../../services/simulation/simulatorService';
import TransitMap from '../../components/map/TransitMap';
import Badge from '../../components/common/Badge';

export default function AdminDashboard() {
  const [data, setData] = useState({
    buses: store.buses,
    routes: store.routes,
    stops: store.stops,
    drivers: store.drivers,
    locations: store.locations,
    alerts: store.alerts,
    simulationActive: store.simulationActive,
    simulationPaused: store.simulationPaused,
  });

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'buses', 'routes', 'stops', 'drivers', 'alerts'
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertMessage, setNewAlertMessage] = useState('');
  const [newAlertRouteId, setNewAlertRouteId] = useState(store.routes[0]?.id);

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => setData({ ...updated }));
    return () => unsubscribe();
  }, []);

  const totalBuses = data.buses.length;
  const activeBuses = data.buses.filter(b => b.status === 'on_time').length;
  const delayedBuses = data.buses.filter(b => b.status === 'delayed').length;
  const breakdownBuses = data.buses.filter(b => b.status === 'breakdown').length;

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMessage) return;

    store.addAlert({
      title: newAlertTitle,
      message: newAlertMessage,
      severity: 'warning',
      routeId: newAlertRouteId,
    });

    setNewAlertTitle('');
    setNewAlertMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* Header & Demo Control Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Central Transport Authority Dispatch Console
          </div>
          <h1 className="text-2xl font-black">Admin Operational Fleet Command</h1>
          <p className="text-xs text-slate-400 mt-1">Manage fleet, drivers, routes, service alerts, and hackathon demo simulation</p>
        </div>

        {/* Demo Simulation Controls */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-extrabold uppercase text-purple-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              Demo Simulation Deck
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              data.simulationActive && !data.simulationPaused ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
            }`}>
              {data.simulationActive && !data.simulationPaused ? 'RUNNING' : data.simulationPaused ? 'PAUSED' : 'STOPPED'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!data.simulationActive || data.simulationPaused ? (
              <button
                onClick={() => simulatorService.start()}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Demo
              </button>
            ) : (
              <button
                onClick={() => simulatorService.pause()}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause
              </button>
            )}

            <button
              onClick={() => simulatorService.stop()}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop
            </button>

            <button
              onClick={() => simulatorService.reset()}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 font-medium text-xs">Total Fleet Count</div>
          <div className="font-black text-slate-900 text-2xl">{totalBuses} buses</div>
          <div className="text-[11px] text-slate-500">{data.routes.length} active routes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 font-medium text-xs">On-Time Buses</div>
          <div className="font-black text-emerald-600 text-2xl">{activeBuses}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Normal Operation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 font-medium text-xs">Delayed Vehicles</div>
          <div className="font-black text-amber-600 text-2xl">{delayedBuses}</div>
          <div className="text-[11px] text-amber-700 font-medium">Traffic / Congestion</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 font-medium text-xs">Maintenance / Emergency</div>
          <div className="font-black text-rose-600 text-2xl">{breakdownBuses}</div>
          <div className="text-[11px] text-rose-700 font-medium">Attention Required</div>
        </div>
      </div>

      {/* Management Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'fleet' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Fleet Map
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'buses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bus Fleet ({data.buses.length})
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'routes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Routes ({data.routes.length})
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'drivers' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Drivers ({data.drivers.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'alerts' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Service Alerts ({data.alerts.length})
        </button>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'fleet' && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-[550px]">
          <TransitMap
            buses={data.buses}
            locations={data.locations}
            routes={data.routes}
            stops={data.stops}
          />
        </div>
      )}

      {activeTab === 'buses' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 font-bold">Bus Number</th>
                <th className="p-4 font-bold">Vehicle Type</th>
                <th className="p-4 font-bold">Assigned Route</th>
                <th className="p-4 font-bold">Driver</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.buses.map((bus) => {
                const route = data.routes.find(r => r.id === bus.routeId);
                const driver = data.drivers.find(d => d.id === bus.driverId);
                return (
                  <tr key={bus.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{bus.busNumber}</td>
                    <td className="p-4 text-slate-600">{bus.vehicleType}</td>
                    <td className="p-4 text-slate-800 font-semibold">{route?.name || 'Unassigned'}</td>
                    <td className="p-4 text-slate-700">{driver?.name || 'Unassigned'}</td>
                    <td className="p-4"><Badge status={bus.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.routes.map((route) => (
            <div key={route.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg text-xs border border-brand-200">
                  Route {route.routeNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">{route.distanceKm} km</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{route.name}</h3>
              <p className="text-xs text-slate-500">{route.stopIds.length} stops • Hours: {route.operatingHours}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 font-bold">Driver Name</th>
                <th className="p-4 font-bold">Contact Phone</th>
                <th className="p-4 font-bold">Assigned Bus ID</th>
                <th className="p-4 font-bold">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{d.name}</td>
                  <td className="p-4 font-mono text-slate-600">{d.phone}</td>
                  <td className="p-4 font-semibold text-brand-600">{d.assignedBusId}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                      ACTIVE DUTY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Alert Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-brand-600" /> Dispatch Service Alert
            </h3>
            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  placeholder="Road Congestion on Route 101"
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Route</label>
                <select
                  value={newAlertRouteId}
                  onChange={(e) => setNewAlertRouteId(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  {data.routes.map(r => (
                    <option key={r.id} value={r.id}>Route {r.routeNumber} — {r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  placeholder="Detail delay, detour, or maintenance notice..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl h-20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Broadcast Passenger Alert
              </button>
            </form>
          </div>

          {/* Active Alerts List */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-base text-slate-900">Active Service Announcements</h3>
            {data.alerts.map(a => (
              <div key={a.id} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {a.title}
                </div>
                <p className="text-amber-800">{a.message}</p>
                <div className="text-[10px] text-amber-600 pt-1 border-t border-amber-200/60">
                  Dispatched by: {a.createdBy} • Route: {a.routeId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
