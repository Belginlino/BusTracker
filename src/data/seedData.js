// Realistic Tier-2 Town Transit Data (Mysuru Transit Network)

export const INITIAL_STOPS = [
  // Route 101 Stops (Central Bus Station to University Campus)
  { id: 'stop_101_1', name: 'Central Bus Station (CBS)', latitude: 12.3118, longitude: 76.6529, routeIds: ['route_101', 'route_102'], active: true },
  { id: 'stop_101_2', name: 'City Palace East Gate', latitude: 12.3052, longitude: 76.6554, routeIds: ['route_101', 'route_104'], active: true },
  { id: 'stop_101_3', name: 'K.R. Circle / Clock Tower', latitude: 12.3089, longitude: 76.6508, routeIds: ['route_101', 'route_103'], active: true },
  { id: 'stop_101_4', name: 'Devaraja Market', latitude: 12.3142, longitude: 76.6481, routeIds: ['route_101'], active: true },
  { id: 'stop_101_5', name: 'District Hospital Junction', latitude: 12.3195, longitude: 76.6425, routeIds: ['route_101', 'route_105'], active: true },
  { id: 'stop_101_6', name: 'University Main Gate', latitude: 12.3150, longitude: 76.6330, routeIds: ['route_101'], active: true },
  { id: 'stop_101_7', name: 'Manasagangotri Library', latitude: 12.3090, longitude: 76.6260, routeIds: ['route_101'], active: true },

  // Route 102 Stops (CBS to Industrial Suburb / Chamundi Foothills)
  { id: 'stop_102_1', name: 'Suburban Bus Stand', latitude: 12.3105, longitude: 76.6580, routeIds: ['route_102'], active: true },
  { id: 'stop_102_2', name: 'Race Course Circle', latitude: 12.2980, longitude: 76.6630, routeIds: ['route_102'], active: true },
  { id: 'stop_102_3', name: 'Zoo Main Gate', latitude: 12.2950, longitude: 76.6680, routeIds: ['route_102'], active: true },
  { id: 'stop_102_4', name: 'Karanji Lake Entrance', latitude: 12.2920, longitude: 76.6740, routeIds: ['route_102'], active: true },
  { id: 'stop_102_5', name: 'Chamundi Hill Foothills', latitude: 12.2850, longitude: 76.6820, routeIds: ['route_102'], active: true },
  { id: 'stop_102_6', name: 'Nandi Statue Junction', latitude: 12.2780, longitude: 76.6850, routeIds: ['route_102'], active: true },

  // Route 103 Stops (Railway Station to Tech Park)
  { id: 'stop_103_1', name: 'City Railway Station', latitude: 12.3168, longitude: 76.6495, routeIds: ['route_103'], active: true },
  { id: 'stop_103_2', name: 'Metropole Circle', latitude: 12.3102, longitude: 76.6448, routeIds: ['route_103'], active: true },
  { id: 'stop_103_3', name: 'CFTRI Campus Gate', latitude: 12.3180, longitude: 76.6380, routeIds: ['route_103'], active: true },
  { id: 'stop_103_4', name: 'Vontikoppal Temple', latitude: 12.3260, longitude: 76.6360, routeIds: ['route_103'], active: true },
  { id: 'stop_103_5', name: 'Gokulam 3rd Stage', latitude: 12.3320, longitude: 76.6310, routeIds: ['route_103'], active: true },
  { id: 'stop_103_6', name: 'Hebbal IT Park Complex', latitude: 12.3480, longitude: 76.6200, routeIds: ['route_103'], active: true },

  // Route 104 Stops (Ring Road Outer Circuit)
  { id: 'stop_104_1', name: 'Columbia Asia Junction', latitude: 12.3520, longitude: 76.6540, routeIds: ['route_104'], active: true },
  { id: 'stop_104_2', name: 'KRS Road Circle', latitude: 12.3440, longitude: 76.6390, routeIds: ['route_104'], active: true },
  { id: 'stop_104_3', name: 'Hunsur Road Flyover', latitude: 12.3210, longitude: 76.6190, routeIds: ['route_104'], active: true },
  { id: 'stop_104_4', name: 'Bogadi Ring Road Junction', latitude: 12.2980, longitude: 76.6140, routeIds: ['route_104'], active: true },
  { id: 'stop_104_5', name: 'Nanjangud Road Interchange', latitude: 12.2680, longitude: 76.6480, routeIds: ['route_104'], active: true },
  { id: 'stop_104_6', name: 'Bannur Road Circle', latitude: 12.3020, longitude: 76.6890, routeIds: ['route_104'], active: true },

  // Route 105 Stops (North Suburban Bus Terminal to Airport Terminal)
  { id: 'stop_105_1', name: 'Hebbal Industrial Estate', latitude: 12.3550, longitude: 76.6150, routeIds: ['route_105'], active: true },
  { id: 'stop_105_2', name: 'Vijayanagar 4th Stage', latitude: 12.3380, longitude: 76.6080, routeIds: ['route_105'], active: true },
  { id: 'stop_105_3', name: 'Kuvempunagar Bus Depot', latitude: 12.2890, longitude: 76.6310, routeIds: ['route_105'], active: true },
  { id: 'stop_105_4', name: 'J.P. Nagar Shopping Complex', latitude: 12.2740, longitude: 76.6390, routeIds: ['route_105'], active: true },
  { id: 'stop_105_5', name: 'Kadakola Industrial Area', latitude: 12.2150, longitude: 76.6620, routeIds: ['route_105'], active: true },
];

export const INITIAL_ROUTES = [
  {
    id: 'route_101',
    routeNumber: '101',
    name: 'Central Bus Stand ↔ University Campus',
    startPoint: 'Central Bus Station (CBS)',
    destination: 'Manasagangotri Library',
    stopIds: ['stop_101_1', 'stop_101_2', 'stop_101_3', 'stop_101_4', 'stop_101_5', 'stop_101_6', 'stop_101_7'],
    distanceKm: 8.5,
    estimatedDurationMin: 22,
    operatingHours: '06:00 AM - 10:30 PM',
    active: true,
    coordinates: [
      { lat: 12.3118, lng: 76.6529 },
      { lat: 12.3052, lng: 76.6554 },
      { lat: 12.3089, lng: 76.6508 },
      { lat: 12.3142, lng: 76.6481 },
      { lat: 12.3195, lng: 76.6425 },
      { lat: 12.3150, lng: 76.6330 },
      { lat: 12.3090, lng: 76.6260 },
    ]
  },
  {
    id: 'route_102',
    routeNumber: '102',
    name: 'CBS ↔ Chamundi Foothills',
    startPoint: 'Central Bus Station (CBS)',
    destination: 'Nandi Statue Junction',
    stopIds: ['stop_101_1', 'stop_102_1', 'stop_102_2', 'stop_102_3', 'stop_102_4', 'stop_102_5', 'stop_102_6'],
    distanceKm: 11.2,
    estimatedDurationMin: 28,
    operatingHours: '05:30 AM - 09:30 PM',
    active: true,
    coordinates: [
      { lat: 12.3118, lng: 76.6529 },
      { lat: 12.3105, lng: 76.6580 },
      { lat: 12.2980, lng: 76.6630 },
      { lat: 12.2950, lng: 76.6680 },
      { lat: 12.2920, lng: 76.6740 },
      { lat: 12.2850, lng: 76.6820 },
      { lat: 12.2780, lng: 76.6850 },
    ]
  },
  {
    id: 'route_103',
    routeNumber: '103',
    name: 'Railway Station ↔ Hebbal Tech Park',
    startPoint: 'City Railway Station',
    destination: 'Hebbal IT Park Complex',
    stopIds: ['stop_103_1', 'stop_103_2', 'stop_103_3', 'stop_103_4', 'stop_103_5', 'stop_103_6'],
    distanceKm: 9.8,
    estimatedDurationMin: 24,
    operatingHours: '06:30 AM - 11:00 PM',
    active: true,
    coordinates: [
      { lat: 12.3168, lng: 76.6495 },
      { lat: 12.3102, lng: 76.6448 },
      { lat: 12.3180, lng: 76.6380 },
      { lat: 12.3260, lng: 76.6360 },
      { lat: 12.3320, lng: 76.6310 },
      { lat: 12.3480, lng: 76.6200 },
    ]
  },
  {
    id: 'route_104',
    routeNumber: '104',
    name: 'Outer Ring Express Line',
    startPoint: 'Columbia Asia Junction',
    destination: 'Bannur Road Circle',
    stopIds: ['stop_104_1', 'stop_104_2', 'stop_104_3', 'stop_104_4', 'stop_104_5', 'stop_104_6'],
    distanceKm: 18.4,
    estimatedDurationMin: 35,
    operatingHours: '06:00 AM - 10:00 PM',
    active: true,
    coordinates: [
      { lat: 12.3520, lng: 76.6540 },
      { lat: 12.3440, lng: 76.6390 },
      { lat: 12.3210, lng: 76.6190 },
      { lat: 12.2980, lng: 76.6140 },
      { lat: 12.2680, lng: 76.6480 },
      { lat: 12.3020, lng: 76.6890 },
    ]
  },
  {
    id: 'route_105',
    routeNumber: '105',
    name: 'Hebbal ↔ Kadakola Connector',
    startPoint: 'Hebbal Industrial Estate',
    destination: 'Kadakola Industrial Area',
    stopIds: ['stop_105_1', 'stop_105_2', 'stop_105_3', 'stop_105_4', 'stop_105_5'],
    distanceKm: 21.0,
    estimatedDurationMin: 40,
    operatingHours: '05:00 AM - 11:30 PM',
    active: true,
    coordinates: [
      { lat: 12.3550, lng: 76.6150 },
      { lat: 12.3380, lng: 76.6080 },
      { lat: 12.2890, lng: 76.6310 },
      { lat: 12.2740, lng: 76.6390 },
      { lat: 12.2150, lng: 76.6620 },
    ]
  }
];

export const INITIAL_BUSES = [
  { id: 'bus_101_A', busNumber: 'KA-09-F-1001', vehicleType: 'City AC Express', capacity: 45, routeId: 'route_101', driverId: 'driver_1', status: 'on_time', active: true },
  { id: 'bus_101_B', busNumber: 'KA-09-F-1002', vehicleType: 'Standard City Bus', capacity: 55, routeId: 'route_101', driverId: 'driver_2', status: 'delayed', active: true },
  { id: 'bus_102_A', busNumber: 'KA-09-F-2001', vehicleType: 'Electric Mini Bus', capacity: 30, routeId: 'route_102', driverId: 'driver_3', status: 'on_time', active: true },
  { id: 'bus_102_B', busNumber: 'KA-09-F-2002', vehicleType: 'Standard City Bus', capacity: 55, routeId: 'route_102', driverId: 'driver_4', status: 'on_time', active: true },
  { id: 'bus_103_A', busNumber: 'KA-09-F-3001', vehicleType: 'Tech Metro Low-Floor', capacity: 60, routeId: 'route_103', driverId: 'driver_5', status: 'on_time', active: true },
  { id: 'bus_103_B', busNumber: 'KA-09-F-3002', vehicleType: 'Standard City Bus', capacity: 55, routeId: 'route_103', driverId: 'driver_6', status: 'breakdown', active: true },
  { id: 'bus_104_A', busNumber: 'KA-09-F-4001', vehicleType: 'Ring Express Volvo', capacity: 48, routeId: 'route_104', driverId: 'driver_7', status: 'on_time', active: true },
  { id: 'bus_104_B', busNumber: 'KA-09-F-4002', vehicleType: 'Standard City Bus', capacity: 55, routeId: 'route_104', driverId: 'driver_8', status: 'delayed', active: true },
  { id: 'bus_105_A', busNumber: 'KA-09-F-5001', vehicleType: 'Industrial Shuttle', capacity: 50, routeId: 'route_105', driverId: 'driver_9', status: 'on_time', active: true },
  { id: 'bus_105_B', busNumber: 'KA-09-F-5002', vehicleType: 'Standard City Bus', capacity: 55, routeId: 'route_105', driverId: 'driver_10', status: 'on_time', active: true }
];

export const INITIAL_DRIVERS = [
  { id: 'driver_1', userId: 'user_driver_1', name: 'Ramesh Kumar', phone: '+91 98765 43210', assignedBusId: 'bus_101_A', active: true },
  { id: 'driver_2', userId: 'user_driver_2', name: 'Suresh Patil', phone: '+91 98765 43211', assignedBusId: 'bus_101_B', active: true },
  { id: 'driver_3', userId: 'user_driver_3', name: 'Anand Gowda', phone: '+91 98765 43212', assignedBusId: 'bus_102_A', active: true },
  { id: 'driver_4', userId: 'user_driver_4', name: 'Manjunath B.', phone: '+91 98765 43213', assignedBusId: 'bus_102_B', active: true },
  { id: 'driver_5', userId: 'user_driver_5', name: 'Prakash Naik', phone: '+91 98765 43214', assignedBusId: 'bus_103_A', active: true },
  { id: 'driver_6', userId: 'user_driver_6', name: 'Venkatesh Rao', phone: '+91 98765 43215', assignedBusId: 'bus_103_B', active: true },
  { id: 'driver_7', userId: 'user_driver_7', name: 'Sunil Hegde', phone: '+91 98765 43216', assignedBusId: 'bus_104_A', active: true },
  { id: 'driver_8', userId: 'user_driver_8', name: 'Deepak Reddy', phone: '+91 98765 43217', assignedBusId: 'bus_104_B', active: true },
  { id: 'driver_9', userId: 'user_driver_9', name: 'Kiran Shinde', phone: '+91 98765 43218', assignedBusId: 'bus_105_A', active: true },
  { id: 'driver_10', userId: 'user_driver_10', name: 'Mahesh Bhat', phone: '+91 98765 43219', assignedBusId: 'bus_105_B', active: true }
];

export const INITIAL_LOCATIONS = {
  'bus_101_A': { latitude: 12.3118, longitude: 76.6529, speed: 28, heading: 180, timestamp: new Date().toISOString(), routeId: 'route_101', tripId: 'trip_101_A', nextStopId: 'stop_101_2', isDemo: false },
  'bus_101_B': { latitude: 12.3142, longitude: 76.6481, speed: 12, heading: 240, timestamp: new Date().toISOString(), routeId: 'route_101', tripId: 'trip_101_B', nextStopId: 'stop_101_5', isDemo: false },
  'bus_102_A': { latitude: 12.2980, longitude: 76.6630, speed: 32, heading: 135, timestamp: new Date().toISOString(), routeId: 'route_102', tripId: 'trip_102_A', nextStopId: 'stop_102_3', isDemo: false },
  'bus_102_B': { latitude: 12.2920, longitude: 76.6740, speed: 25, heading: 110, timestamp: new Date().toISOString(), routeId: 'route_102', tripId: 'trip_102_B', nextStopId: 'stop_102_5', isDemo: false },
  'bus_103_A': { latitude: 12.3180, longitude: 76.6380, speed: 30, heading: 340, timestamp: new Date().toISOString(), routeId: 'route_103', tripId: 'trip_103_A', nextStopId: 'stop_103_4', isDemo: false },
  'bus_103_B': { latitude: 12.3260, longitude: 76.6360, speed: 0, heading: 0, timestamp: new Date().toISOString(), routeId: 'route_103', tripId: 'trip_103_B', nextStopId: 'stop_103_5', isDemo: false },
  'bus_104_A': { latitude: 12.3210, longitude: 76.6190, speed: 42, heading: 200, timestamp: new Date().toISOString(), routeId: 'route_104', tripId: 'trip_104_A', nextStopId: 'stop_104_4', isDemo: false },
  'bus_104_B': { latitude: 12.2980, longitude: 76.6140, speed: 18, heading: 160, timestamp: new Date().toISOString(), routeId: 'route_104', tripId: 'trip_104_B', nextStopId: 'stop_104_5', isDemo: false },
  'bus_105_A': { latitude: 12.3380, longitude: 76.6080, speed: 35, heading: 190, timestamp: new Date().toISOString(), routeId: 'route_105', tripId: 'trip_105_A', nextStopId: 'stop_105_3', isDemo: false },
  'bus_105_B': { latitude: 12.2740, longitude: 76.6390, speed: 29, heading: 170, timestamp: new Date().toISOString(), routeId: 'route_105', tripId: 'trip_105_B', nextStopId: 'stop_105_5', isDemo: false }
};

export const INITIAL_ALERTS = [
  {
    id: 'alert_1',
    title: 'Devaraja Market Traffic Congestion',
    message: 'Buses on Route 101 experiencing 10-12 min delay near Market Square due to festival roadwork.',
    severity: 'warning',
    routeId: 'route_101',
    active: true,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    createdBy: 'Admin Control'
  },
  {
    id: 'alert_2',
    title: 'Vehicle Maintenance Notice - Bus KA-09-F-3002',
    message: 'Bus 103-B reported engine issue at Gokulam 3rd Stage. Replacement bus dispatched.',
    severity: 'critical',
    routeId: 'route_103',
    active: true,
    createdAt: new Date(Date.now() - 900000).toISOString(),
    createdBy: 'Dispatch Center'
  }
];
