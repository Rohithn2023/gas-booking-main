import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEPOT = {
  id: "DEPOT-01",
  name: "LPG DISTRIBUTOR DEPOT",
  address: "Central Logistics Hub, Erode Main Rd, Tamil Nadu",
  latitude: 11.3410,
  longitude: 77.7172,
  operatingHours: "09:00 - 17:00"
};

const AREAS = [
  { areaId: "AREA-01", areaName: "Gandhi Nagar", group: "North Cluster", latitude: 11.3520, longitude: 77.7120, nearestAreas: ["AREA-02", "AREA-05", "AREA-20"] },
  { areaId: "AREA-02", areaName: "Perundurai Road", group: "North Cluster", latitude: 11.3580, longitude: 77.7050, nearestAreas: ["AREA-01", "AREA-03", "AREA-17"] },
  { areaId: "AREA-03", areaName: "Chithode", group: "Far North Cluster", latitude: 11.3820, longitude: 77.6910, nearestAreas: ["AREA-02", "AREA-04", "AREA-17"] },
  { areaId: "AREA-04", areaName: "Bhavani Road", group: "Far North Cluster", latitude: 11.4100, longitude: 77.6800, nearestAreas: ["AREA-03", "AREA-05"] },
  { areaId: "AREA-05", areaName: "Veerappanchatram", group: "North East Cluster", latitude: 11.3650, longitude: 77.7280, nearestAreas: ["AREA-01", "AREA-06", "AREA-07"] },
  { areaId: "AREA-06", areaName: "BPL Nagar", group: "North East Cluster", latitude: 11.3700, longitude: 77.7390, nearestAreas: ["AREA-05", "AREA-08", "AREA-19"] },
  { areaId: "AREA-07", areaName: "Sampath Nagar", group: "East Central Cluster", latitude: 11.3480, longitude: 77.7300, nearestAreas: ["AREA-05", "AREA-08", "AREA-18"] },
  { areaId: "AREA-08", areaName: "Soolai", group: "East Cluster", latitude: 11.3530, longitude: 77.7510, nearestAreas: ["AREA-06", "AREA-07", "AREA-19"] },
  { areaId: "AREA-09", areaName: "Surampatti", group: "South East Cluster", latitude: 11.3280, longitude: 77.7290, nearestAreas: ["AREA-07", "AREA-10", "AREA-18"] },
  { areaId: "AREA-10", areaName: "Solar", group: "Far South East Cluster", latitude: 11.3010, longitude: 77.7600, nearestAreas: ["AREA-09", "AREA-11", "AREA-19"] },
  { areaId: "AREA-11", areaName: "Kaspapettai", group: "Far South Cluster", latitude: 11.2850, longitude: 77.7210, nearestAreas: ["AREA-10", "AREA-12"] },
  { areaId: "AREA-12", areaName: "Moolapalayam", group: "South Cluster", latitude: 11.3150, longitude: 77.7100, nearestAreas: ["AREA-09", "AREA-11", "AREA-13"] },
  { areaId: "AREA-13", areaName: "Kasipalayam", group: "South West Cluster", latitude: 11.3210, longitude: 77.6950, nearestAreas: ["AREA-12", "AREA-14", "AREA-20"] },
  { areaId: "AREA-14", areaName: "Thindal", group: "West Cluster", latitude: 11.3320, longitude: 77.6740, nearestAreas: ["AREA-13", "AREA-15", "AREA-16"] },
  { areaId: "AREA-15", areaName: "Sengodampalayam", group: "Far West Cluster", latitude: 11.3390, longitude: 77.6510, nearestAreas: ["AREA-14", "AREA-16", "AREA-17"] },
  { areaId: "AREA-16", areaName: "Perundurai Town", group: "Outer West Cluster", latitude: 11.2750, longitude: 77.5850, nearestAreas: ["AREA-14", "AREA-15"] },
  { areaId: "AREA-17", areaName: "Nasiyanur", group: "North West Outer Cluster", latitude: 11.3750, longitude: 77.6320, nearestAreas: ["AREA-02", "AREA-03", "AREA-15"] },
  { areaId: "AREA-18", areaName: "Rangampalayam", group: "East Central Cluster", latitude: 11.3310, longitude: 77.7410, nearestAreas: ["AREA-07", "AREA-09", "AREA-19"] },
  { areaId: "AREA-19", areaName: "Vendipalayam", group: "Far East Cluster", latitude: 11.3410, longitude: 77.7680, nearestAreas: ["AREA-08", "AREA-10", "AREA-18"] },
  { areaId: "AREA-20", areaName: "Railway Colony", group: "Central Hub Cluster", latitude: 11.3360, longitude: 77.7190, nearestAreas: ["AREA-01", "AREA-07", "AREA-13"] }
];

const DRIVERS = [
  { driverId: "DRV-001", driverName: "Ramesh Kumar", phone: "+91 98421 10001", license: "TN33-2018-00912", experience: "8 yrs", rating: 4.9, status: "Active" },
  { driverId: "DRV-002", driverName: "Suresh Murugan", phone: "+91 98421 10002", license: "TN33-2019-00452", experience: "6 yrs", rating: 4.8, status: "Active" },
  { driverId: "DRV-003", driverName: "Karthik Raja", phone: "+91 98421 10003", license: "TN33-2020-00123", experience: "5 yrs", rating: 4.7, status: "Active" },
  { driverId: "DRV-004", driverName: "Venkatesh P", phone: "+91 98421 10004", license: "TN33-2017-00881", experience: "9 yrs", rating: 4.95, status: "Active" },
  { driverId: "DRV-005", driverName: "Mani Kandan", phone: "+91 98421 10005", license: "TN33-2021-00331", experience: "4 yrs", rating: 4.65, status: "Active" },
  { driverId: "DRV-006", driverName: "Ganesh Moorthy", phone: "+91 98421 10006", license: "TN33-2016-00774", experience: "11 yrs", rating: 4.9, status: "Active" },
  { driverId: "DRV-007", driverName: "Dhana Sekaran", phone: "+91 98421 10007", license: "TN33-2022-00512", experience: "3 yrs", rating: 4.6, status: "Active" },
  { driverId: "DRV-008", driverName: "Anbarasu V", phone: "+91 98421 10008", license: "TN33-2019-00998", experience: "7 yrs", rating: 4.85, status: "Active" },
  { driverId: "DRV-009", driverName: "Saravanan T", phone: "+91 98421 10009", license: "TN33-2020-00441", experience: "5 yrs", rating: 4.75, status: "Standby" },
  { driverId: "DRV-010", driverName: "Praveen Kumar", phone: "+91 98421 10010", license: "TN33-2023-00109", experience: "2 yrs", rating: 4.5, status: "Standby" }
];

const VEHICLES = [
  { vehicleId: "VEH-01", vehicleNumber: "TN-33-AB-1001", driverId: "DRV-001", driverName: "Ramesh Kumar", capacity: 40, currentLoad: 36, assignedOrders: 19, assignedCylinders: 36, routeId: "ROUTE-01", totalDistance: 38.4, estimatedDuration: "05h 45m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-02", vehicleNumber: "TN-33-AB-1002", driverId: "DRV-002", driverName: "Suresh Murugan", capacity: 40, currentLoad: 38, assignedOrders: 20, assignedCylinders: 38, routeId: "ROUTE-02", totalDistance: 44.2, estimatedDuration: "06h 10m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-03", vehicleNumber: "TN-33-AB-1003", driverId: "DRV-003", driverName: "Karthik Raja", capacity: 40, currentLoad: 35, assignedOrders: 18, assignedCylinders: 35, routeId: "ROUTE-03", totalDistance: 52.1, estimatedDuration: "06h 30m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-04", vehicleNumber: "TN-33-AB-1004", driverId: "DRV-004", driverName: "Venkatesh P", capacity: 40, currentLoad: 37, assignedOrders: 19, assignedCylinders: 37, routeId: "ROUTE-04", totalDistance: 41.8, estimatedDuration: "05h 55m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-05", vehicleNumber: "TN-33-AB-1005", driverId: "DRV-005", driverName: "Mani Kandan", capacity: 40, currentLoad: 34, assignedOrders: 18, assignedCylinders: 34, routeId: "ROUTE-05", totalDistance: 36.9, estimatedDuration: "05h 30m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-06", vehicleNumber: "TN-33-AB-1006", driverId: "DRV-006", driverName: "Ganesh Moorthy", capacity: 40, currentLoad: 39, assignedOrders: 21, assignedCylinders: 39, routeId: "ROUTE-06", totalDistance: 49.5, estimatedDuration: "06h 40m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-07", vehicleNumber: "TN-33-AB-1007", driverId: "DRV-007", driverName: "Dhana Sekaran", capacity: 40, currentLoad: 35, assignedOrders: 19, assignedCylinders: 35, routeId: "ROUTE-07", totalDistance: 58.7, estimatedDuration: "06h 50m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-08", vehicleNumber: "TN-33-AB-1008", driverId: "DRV-008", driverName: "Anbarasu V", capacity: 40, currentLoad: 36, assignedOrders: 18, assignedCylinders: 36, routeId: "ROUTE-08", totalDistance: 62.3, estimatedDuration: "07h 05m", shiftStart: "09:00", shiftEnd: "17:00", status: "Ready" },
  { vehicleId: "VEH-09", vehicleNumber: "TN-33-AB-1009", driverId: "DRV-009", driverName: "Saravanan T", capacity: 40, currentLoad: 0, assignedOrders: 0, assignedCylinders: 0, routeId: null, totalDistance: 0, estimatedDuration: "00h 00m", shiftStart: "09:00", shiftEnd: "17:00", status: "Standby" },
  { vehicleId: "VEH-10", vehicleNumber: "TN-33-AB-1010", driverId: "DRV-010", driverName: "Praveen Kumar", capacity: 40, currentLoad: 0, assignedOrders: 0, assignedCylinders: 0, routeId: null, totalDistance: 0, estimatedDuration: "00h 00m", shiftStart: "09:00", shiftEnd: "17:00", status: "Maintenance" }
];

const FIRST_NAMES = ["Arun", "Priya", "Kumar", "Suresh", "Lakshmi", "Vijay", "Kavitha", "Deepak", "Anitha", "Ramesh", "Meena", "Santhosh", "Divya", "Gokul", "Nandhini", "Karthik", "Bhavana", "Dinesh", "Radha", "Rajesh", "Swathi", "Balan", "Chitra", "Manoj", "Revathi", "Senthil", "Vidya", "Ashok", "Gayathri", "Prabhu"];
const LAST_NAMES = ["Kumar", "Subramanian", "Rajan", "Murugan", "Natarajan", "Selvam", "Sundaram", "Chandran", "Venkatesan", "Balakrishnan", "Moorthy", "Ganesan", "Krishnan", "Shanmugam", "Pandian", "Elangovan", "Pillai", "Chettiar", "Gounder", "Naidu"];

const STREET_NAMES = [
  "Main Road", "Cross Street", "Anna Salai", "Kamaraj Street", "Bharathi Nagar",
  "Nehru Street", "Gandhi Avenue", "MGR Street", "Periyar Street", "VOB Street",
  "Integration Layout", "Bhavani Cut Rd", "Station Road", "Temple View Rd", "Market Street"
];

const NOTES_LIST = [
  "Ground floor apartment, call on arrival",
  "Ring doorbell at main gate",
  "Commercial kitchen delivery - back entrance",
  "Customer requested delivery before 12 PM if possible",
  "Senior citizen home - please assist with cylinder placement",
  "Pay via UPI on delivery",
  "Leave with security guard if not available",
  "Narrow street, park near corner junction",
  "Two cylinders refill - keep spare outside",
  ""
];

// Generate 200 consumers and orders
const consumers = [];
const orders = [];

let globalOrderCount = 0;

// Route assignments mapping
const routeDefs = [
  { id: "ROUTE-01", name: "North Industrial Route", vehicle: "TN-33-AB-1001", driver: "Ramesh Kumar", areas: ["AREA-01", "AREA-02", "AREA-05"] },
  { id: "ROUTE-02", name: "Far North Highway Route", vehicle: "TN-33-AB-1002", driver: "Suresh Murugan", areas: ["AREA-03", "AREA-04", "AREA-17"] },
  { id: "ROUTE-03", name: "East Central Commercial Route", vehicle: "TN-33-AB-1003", driver: "Karthik Raja", areas: ["AREA-06", "AREA-07", "AREA-08"] },
  { id: "ROUTE-04", name: "South Metro Ring Route", vehicle: "TN-33-AB-1004", driver: "Venkatesh P", areas: ["AREA-09", "AREA-12", "AREA-20"] },
  { id: "ROUTE-05", name: "Far South Radial Route", vehicle: "TN-33-AB-1005", driver: "Mani Kandan", areas: ["AREA-10", "AREA-11"] },
  { id: "ROUTE-06", name: "West Suburban Route", vehicle: "TN-33-AB-1006", driver: "Ganesh Moorthy", areas: ["AREA-13", "AREA-14", "AREA-15"] },
  { id: "ROUTE-07", name: "Far West Outer Express Route", vehicle: "TN-33-AB-1007", driver: "Dhana Sekaran", areas: ["AREA-16"] },
  { id: "ROUTE-08", name: "East Outer Riverfront Route", vehicle: "TN-33-AB-1008", driver: "Anbarasu V", areas: ["AREA-18", "AREA-19"] }
];

// Generate exactly 10 orders per area (10 * 20 = 200 orders total)
AREAS.forEach((area, areaIdx) => {
  const route = routeDefs.find(r => r.areas.includes(area.areaId)) || routeDefs[0];
  
  for (let i = 1; i <= 10; i++) {
    globalOrderCount++;
    const orderNumStr = String(globalOrderCount).padStart(3, '0');
    const orderId = `LPG-${orderNumStr}`;
    const consumerId = `CUS-${orderNumStr}`;
    
    const fn = FIRST_NAMES[(areaIdx * 10 + i) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(areaIdx * 7 + i) % LAST_NAMES.length];
    const consumerName = `${fn} ${ln}`;
    const phone = `+91 9${Math.floor(800000000 + Math.random() * 199999999)}`;
    
    const street = STREET_NAMES[(i + areaIdx) % STREET_NAMES.length];
    const doorNo = `${Math.floor(Math.random() * 120) + 1}/${i}`;
    const address = `${doorNo}, ${street}, ${area.areaName}, Erode`;
    
    // Add small realistic offset from center of area (within ~1-2 km radius)
    const latOffset = (Math.sin(i * 1.5 + areaIdx) * 0.008);
    const lngOffset = (Math.cos(i * 1.5 + areaIdx) * 0.008);
    const latitude = Number((area.latitude + latOffset).toFixed(4));
    const longitude = Number((area.longitude + lngOffset).toFixed(4));
    
    // Refill Qty: mostly 1 or 2 cylinders, occasional 3 for commercial/large family
    const refillQuantity = (i % 7 === 0) ? 3 : (i % 3 === 0 ? 2 : 1);
    
    // Order time between 06:30 and 08:45 AM
    const hour = 6 + Math.floor((i * 12 + areaIdx * 5) / 60);
    const minute = (i * 17 + areaIdx * 11) % 60;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    // FIFO Priority derived from order orderTime
    const fifoPriority = globalOrderCount; 
    
    // Status distribution: ~66% Delivered (132 orders), ~15% Out for Delivery, ~15% Assigned/Pending, ~4% Failed
    let deliveryStatus = "Pending";
    if (globalOrderCount <= 132) {
      deliveryStatus = "Delivered";
    } else if (globalOrderCount <= 165) {
      deliveryStatus = "Out for Delivery";
    } else if (globalOrderCount <= 192) {
      deliveryStatus = "Assigned";
    } else if (globalOrderCount <= 196) {
      deliveryStatus = "Pending";
    } else {
      deliveryStatus = "Failed";
    }

    // Estimate stop sequence within route
    const deliverySequence = i;
    
    // Estimated Delivery Time based on sequence (9:00 AM start + sequence * 20 mins)
    const startMins = 9 * 60 + (deliverySequence - 1) * 20;
    const etaH = Math.floor(startMins / 60);
    const etaM = startMins % 60;
    const estimatedDeliveryTime = `${String(etaH).padStart(2, '0')}:${String(etaM).padStart(2, '0')}`;

    const distFromPrev = Number((1.2 + Math.random() * 3.5).toFixed(1));
    const serviceTime = 5 + (refillQuantity > 1 ? 3 : 0);
    const notes = NOTES_LIST[globalOrderCount % NOTES_LIST.length];

    consumers.push({
      consumerId,
      consumerName,
      phone,
      address,
      areaId: area.areaId,
      areaName: area.areaName,
      totalOrdersHistory: Math.floor(Math.random() * 15) + 3,
      consumerType: refillQuantity >= 3 ? "Commercial" : "Residential"
    });

    orders.push({
      orderId,
      consumerId,
      consumerName,
      phone,
      address,
      areaId: area.areaId,
      areaName: area.areaName,
      latitude,
      longitude,
      refillQuantity,
      orderDate: "2026-10-05",
      orderTime: timeStr,
      fifoPriority,
      assignedRoute: route.id,
      assignedVehicle: route.vehicle,
      deliverySequence,
      estimatedDeliveryTime,
      deliveryStatus,
      distanceFromPreviousStop: distFromPrev,
      deliveryServiceTime: serviceTime,
      notes
    });
  }
});

// Construct Routes object
const routes = routeDefs.map((r) => {
  const routeOrders = orders.filter(o => o.assignedRoute === r.id);
  const totalCylinders = routeOrders.reduce((sum, o) => sum + o.refillQuantity, 0);
  const totalOrders = routeOrders.length;
  const vehicleObj = VEHICLES.find(v => v.vehicleNumber === r.vehicle);
  const vehicleCap = vehicleObj ? vehicleObj.capacity : 40;
  const utilization = Math.round((totalCylinders / vehicleCap) * 100);

  // Total route distance sum
  const totalDistance = Number(routeOrders.reduce((sum, o) => sum + o.distanceFromPreviousStop, 8.5).toFixed(1));
  const drivingTimeMins = Math.round(totalDistance * 3.5);
  const deliveryTimeMins = totalOrders * 6;
  const totalDurationMins = drivingTimeMins + deliveryTimeMins;
  
  const driveH = Math.floor(drivingTimeMins / 60);
  const driveM = drivingTimeMins % 60;
  const delivH = Math.floor(deliveryTimeMins / 60);
  const delivM = deliveryTimeMins % 60;
  const totalH = Math.floor(totalDurationMins / 60);
  const totalM = totalDurationMins % 60;

  const returnMins = 9 * 60 + totalDurationMins;
  const retH = Math.floor(returnMins / 60);
  const retM = returnMins % 60;

  return {
    routeId: r.id,
    routeName: r.name,
    assignedVehicle: r.vehicle,
    driver: r.driver,
    areas: r.areas,
    orders: routeOrders.map(o => o.orderId),
    totalOrders,
    totalCylinders,
    vehicleCapacity: vehicleCap,
    capacityUtilization: utilization,
    totalDistance,
    estimatedDrivingTime: `${String(driveH).padStart(2, '0')}h ${String(driveM).padStart(2, '0')}m`,
    estimatedDeliveryTime: `${String(delivH).padStart(2, '0')}h ${String(delivM).padStart(2, '0')}m`,
    totalRouteDuration: `${String(totalH).padStart(2, '0')}h ${String(totalM).padStart(2, '0')}m`,
    startTime: "09:00",
    expectedReturnTime: `${String(retH).padStart(2, '0')}:${String(retM).padStart(2, '0')}`,
    status: "Optimized"
  };
});

// Calculate area statistics
const areasData = AREAS.map(a => {
  const areaOrders = orders.filter(o => o.areaId === a.areaId);
  const totalCylinders = areaOrders.reduce((sum, o) => sum + o.refillQuantity, 0);
  const route = routeDefs.find(r => r.areas.includes(a.areaId));
  return {
    ...a,
    totalOrders: areaOrders.length,
    totalCylinders,
    avgDistance: 3.2,
    assignedRoute: route ? route.id : "ROUTE-01",
    assignedVehicle: route ? route.vehicle : "TN-33-AB-1001",
    priorityLevel: "High"
  };
});

const outputDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'depot.json'), JSON.stringify(DEPOT, null, 2));
fs.writeFileSync(path.join(outputDir, 'areas.json'), JSON.stringify(areasData, null, 2));
fs.writeFileSync(path.join(outputDir, 'drivers.json'), JSON.stringify(DRIVERS, null, 2));
fs.writeFileSync(path.join(outputDir, 'vehicles.json'), JSON.stringify(VEHICLES, null, 2));
fs.writeFileSync(path.join(outputDir, 'routes.json'), JSON.stringify(routes, null, 2));
fs.writeFileSync(path.join(outputDir, 'consumers.json'), JSON.stringify(consumers, null, 2));
fs.writeFileSync(path.join(outputDir, 'orders.json'), JSON.stringify(orders, null, 2));

console.log(`Successfully generated ${orders.length} orders, ${areasData.length} areas, ${VEHICLES.length} vehicles, ${routes.length} routes, ${consumers.length} consumers!`);
