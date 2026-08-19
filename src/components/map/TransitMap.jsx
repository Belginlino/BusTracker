import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER, BUS_STATUS } from '../../utils/constants';
import { formatTimeAgo, formatSpeed } from '../../utils/formatters';
import { calculateETA } from '../../services/tracking/etaCalculator';
import Badge from '../common/Badge';

// Helper component to auto-recenter map when focus object changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom || map.getZoom(), { duration: 1 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet Bus Icon Generator
function createBusIcon(status, isDemo, busNumber) {
  let bgColor = '#10b981'; // Emerald
  if (status === BUS_STATUS.DELAYED) bgColor = '#f59e0b';
  if (status === BUS_STATUS.BREAKDOWN) bgColor = '#ef4444';
  if (isDemo) bgColor = '#8b5cf6';

  const html = `
    <div class="relative group cursor-pointer">
      ${isDemo ? '<div class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span></div>' : ''}
      <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xl border-2 border-white font-bold text-xs transform hover:scale-110 transition-all" style="background-color: ${bgColor};">
        🚌
      </div>
      <div class="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap absolute -bottom-5 left-1/2 transform -translate-x-1/2">
        ${busNumber.split('-').pop()}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

// Custom Stop Icon
const stopIcon = L.divIcon({
  html: `<div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-md"></div>`,
  className: 'custom-stop-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function TransitMap({ 
  buses = [], 
  locations = {}, 
  routes = [], 
  stops = [], 
  selectedBusId = null,
  selectedRouteId = null,
  onSelectBus = () => {},
  center = DEFAULT_MAP_CENTER,
  zoom = 13,
}) {
  const activeRoutes = selectedRouteId 
    ? routes.filter(r => r.id === selectedRouteId)
    : routes;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} zoom={zoom} />

        {/* Route Polylines */}
        {activeRoutes.map((route) => {
          if (!route.coordinates || !route.coordinates.length) return null;
          const polylineCoords = route.coordinates.map(c => [c.lat, c.lng]);
          return (
            <Polyline
              key={route.id}
              positions={polylineCoords}
              pathOptions={{
                color: selectedRouteId === route.id ? '#2563eb' : '#64748b',
                weight: selectedRouteId === route.id ? 5 : 3,
                opacity: selectedRouteId === route.id ? 0.9 : 0.6,
                dashArray: selectedRouteId === route.id ? null : '4, 8',
              }}
            />
          );
        })}

        {/* Bus Stop Markers */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.latitude, stop.longitude]}
            icon={stopIcon}
          >
            <Popup>
              <div className="p-3 text-slate-800 max-w-xs">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  🚏 {stop.name}
                </div>
                <p className="text-xs text-slate-500 mt-1">Routes serving this stop:</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {stop.routeIds?.map(rid => {
                    const r = routes.find(rt => rt.id === rid);
                    return r ? (
                      <span key={rid} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border">
                        {r.routeNumber}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live Bus Markers */}
        {buses.map((bus) => {
          const loc = locations[bus.id];
          if (!loc || !loc.latitude || !loc.longitude) return null;

          const route = routes.find(r => r.id === bus.routeId);
          const nextStop = stops.find(s => s.id === loc.nextStopId);
          const etaInfo = calculateETA({ busLocation: loc, targetStop: nextStop });

          return (
            <Marker
              key={bus.id}
              position={[loc.latitude, loc.longitude]}
              icon={createBusIcon(bus.status, loc.isDemo, bus.busNumber)}
              eventHandlers={{
                click: () => onSelectBus(bus),
              }}
            >
              <Popup>
                <div className="p-3 max-w-xs space-y-2 text-slate-800">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{bus.busNumber}</div>
                      <div className="text-xs text-slate-500">{route?.name || 'Active City Route'}</div>
                    </div>
                    <Badge status={bus.status} />
                  </div>

                  {loc.isDemo && (
                    <div className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider text-center border border-purple-200">
                      ⚡ DEMO SIMULATION
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Next Stop:</span>
                      <span className="font-semibold text-slate-900">{nextStop?.name || 'En route'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ETA:</span>
                      <span className="font-bold text-brand-600">{etaInfo.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Speed:</span>
                      <span className="font-medium text-slate-700">{formatSpeed(loc.speed)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t">
                      <span>Updated:</span>
                      <span>{formatTimeAgo(loc.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
