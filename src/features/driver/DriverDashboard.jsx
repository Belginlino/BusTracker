import React, { useState, useEffect } from 'react';
import { Bus, Navigation, Play, Square, AlertTriangle, ShieldAlert, CheckCircle2, Radio, Gauge, MapPin } from 'lucide-react';
import { store } from '../../data/store';
import { locationService } from '../../services/tracking/locationService';
import { formatSpeed, formatTimeAgo } from '../../utils/formatters';
import Badge from '../../components/common/Badge';

export default function DriverDashboard() {
  const [data, setData] = useState({
    buses: store.buses,
    routes: store.routes,
    stops: store.stops,
    locations: store.locations,
  });

  const [selectedBusId, setSelectedBusId] = useState(store.buses[0]?.id);
  const [isTripActive, setIsTripActive] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [delayMinutes, setDelayMinutes] = useState('');
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe((updated) => setData({ ...updated }));
    return () => unsubscribe();
  }, []);

  const assignedBus = data.buses.find(b => b.id === selectedBusId) || data.buses[0];
  const assignedRoute = data.routes.find(r => r.id === assignedBus?.routeId);
  const currentLocation = data.locations[assignedBus?.id];
  const nextStop = data.stops.find(s => s.id === currentLocation?.nextStopId);

  const handleStartTrip = () => {
    setIsTripActive(true);
    handleToggleGps(true);
  };

  const handleEndTrip = () => {
    setIsTripActive(false);
    handleToggleGps(false);
  };

  const handleToggleGps = (enable) => {
    setGpsError('');
    if (enable) {
      setIsGpsActive(true);
      locationService.startTracking(
        assignedBus.id,
        assignedRoute?.id,
        `trip_${assignedBus.id}`,
        assignedRoute?.stopIds[0] || 'stop_101_1',
        (loc) => {
          store.updateLocation(assignedBus.id, loc);
        },
        (err) => {
          setGpsError(err);
          setIsGpsActive(false);
        }
      );
    } else {
      setIsGpsActive(false);
      locationService.stopTracking();
    }
  };

  const handleReportDelay = (e) => {
    e.preventDefault();
    if (!delayMinutes) return;

    store.addAlert({
      title: `Bus ${assignedBus.busNumber} Delayed`,
      message: `Driver reported a ${delayMinutes} minute delay due to traffic.`,
      severity: 'warning',
      routeId: assignedRoute?.id,
    });

    setShowDelayModal(false);
    setDelayMinutes('');
  };

  const handleReportBreakdown = () => {
    store.addAlert({
      title: `EMERGENCY: Bus ${assignedBus.busNumber} Breakdown`,
      message: `Mechanical breakdown reported by driver on Route ${assignedRoute?.routeNumber}. Passenger transfer required.`,
      severity: 'critical',
      routeId: assignedRoute?.id,
    });

    setShowBreakdownModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6 flex-1">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            Driver Operational Portal
          </div>
          <h1 className="text-2xl font-black">Driver GPS Cockpit</h1>
          <p className="text-xs text-slate-400">Transmit real-time GPS coordinates directly to passengers</p>
        </div>

        {/* Bus Selector */}
        <div className="bg-slate-800 p-2 rounded-2xl border border-slate-700">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Assigned Bus</label>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white font-bold text-xs py-2 px-3 rounded-xl focus:outline-none"
          >
            {data.buses.map(b => (
              <option key={b.id} value={b.id}>{b.busNumber} ({b.vehicleType})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Trip Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{assignedBus?.busNumber}</h2>
              <Badge status={assignedBus?.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Route {assignedRoute?.routeNumber} — {assignedRoute?.name}</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Trip Status</div>
            <div className={`font-black text-sm uppercase ${isTripActive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isTripActive ? 'IN PROGRESS' : 'NOT STARTED'}
            </div>
          </div>
        </div>

        {/* Trip Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isTripActive ? (
            <button
              onClick={handleStartTrip}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Assigned Trip
            </button>
          ) : (
            <button
              onClick={handleEndTrip}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Square className="w-5 h-5 fill-current" />
              End Trip & Stop GPS
            </button>
          )}

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xs">Device Geolocation GPS</div>
              <div className="text-[11px] text-slate-500">
                {isGpsActive ? 'Transmitting positions every 5s / 10m' : 'GPS engine idle'}
              </div>
            </div>
            <button
              onClick={() => handleToggleGps(!isGpsActive)}
              disabled={!isTripActive}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isGpsActive
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {isGpsActive ? 'GPS ACTIVE' : 'ENABLE GPS'}
            </button>
          </div>
        </div>

        {gpsError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Real-time Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs">
          <div>
            <div className="text-slate-400 font-medium">Current Speed</div>
            <div className="font-black text-slate-900 text-base mt-0.5">{formatSpeed(currentLocation?.speed)}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Next Scheduled Stop</div>
            <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">{nextStop?.name || 'En route'}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Latitude</div>
            <div className="font-mono text-slate-700 text-xs mt-0.5">{currentLocation?.latitude?.toFixed(4) || '—'}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Longitude</div>
            <div className="font-mono text-slate-700 text-xs mt-0.5">{currentLocation?.longitude?.toFixed(4) || '—'}</div>
          </div>
        </div>

        {/* Operational Incident Reporting Buttons */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowDelayModal(true)}
            className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Report Traffic Delay
          </button>

          <button
            onClick={() => setShowBreakdownModal(true)}
            className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Report Vehicle Breakdown
          </button>
        </div>

      </div>

      {/* Delay Modal */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Report Traffic Delay</h3>
            <form onSubmit={handleReportDelay} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Delay (Minutes)</label>
                <input
                  type="number"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  placeholder="15"
                  className="w-full p-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDelayModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl"
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Breakdown Emergency Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Confirm Breakdown Alert</h3>
            <p className="text-xs text-slate-600">
              This will notify central transport control and display an emergency alert to all passengers on this route.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportBreakdown}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl"
              >
                Broadcast Emergency
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
