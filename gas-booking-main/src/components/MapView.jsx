import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';

// Route vehicle colors for visual differentiation
const ROUTE_COLORS = {
  'ROUTE-01': '#0B6B4B', // Deep Green
  'ROUTE-02': '#D97706', // Amber / Orange
  'ROUTE-03': '#2563EB', // Royal Blue
  'ROUTE-04': '#9333EA', // Purple
  'ROUTE-05': '#DC2626', // Red
  'ROUTE-06': '#0891B2', // Cyan
  'ROUTE-07': '#4F46E5', // Indigo
  'ROUTE-08': '#059669'  // Emerald
};

export default function MapView({ 
  selectedRouteId = null, 
  selectedOrderId = null, 
  height = '100%',
  showAllRoutes = true 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  const { depot, orders, routes, setSelectedOrderId } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [depot.latitude, depot.longitude],
        zoom: 12,
        zoomControl: false
      });

      // Add clean CartoDB Positron tiles for high-end enterprise aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers & polylines
    markersRef.current.forEach(m => m.remove());
    polylinesRef.current.forEach(p => p.remove());
    markersRef.current = [];
    polylinesRef.current = [];

    // 1. Add Depot Marker
    const depotIconHtml = `
      <div style="
        background-color: #171A17;
        color: #FFFFFF;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        border: 3px solid #0B6B4B;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">DEPOT</div>
    `;

    const depotIcon = L.divIcon({
      html: depotIconHtml,
      className: 'custom-depot-pin',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const depotMarker = L.marker([depot.latitude, depot.longitude], { icon: depotIcon })
      .bindPopup(`
        <div style="padding: 4px; font-family: sans-serif;">
          <b style="color: #0B6B4B; font-size: 13px;">${depot.name}</b><br/>
          <span style="font-size: 11px; color: #666;">${depot.address}</span><br/>
          <span style="font-size: 11px; font-weight: bold; color: #171A17;">Hours: ${depot.operatingHours}</span>
        </div>
      `)
      .addTo(map);

    markersRef.current.push(depotMarker);

    // 2. Filter orders to plot based on selectedRouteId or selectedOrderId
    let activeOrders = orders;
    if (selectedRouteId) {
      activeOrders = orders.filter(o => o.assignedRoute === selectedRouteId);
    }

    // Sort active orders by deliverySequence
    const routeGroups = {};
    activeOrders.forEach(o => {
      if (!routeGroups[o.assignedRoute]) {
        routeGroups[o.assignedRoute] = [];
      }
      routeGroups[o.assignedRoute].push(o);
    });

    // 3. Draw route lines and stop markers per route
    Object.keys(routeGroups).forEach(routeId => {
      const groupOrders = routeGroups[routeId].sort((a, b) => a.deliverySequence - b.deliverySequence);
      const color = ROUTE_COLORS[routeId] || '#0B6B4B';
      const isSelectedRoute = selectedRouteId === routeId;

      // Polyline coordinates from Depot -> Stop 1 -> Stop 2 ... -> Depot
      const points = [
        [depot.latitude, depot.longitude],
        ...groupOrders.map(o => [o.latitude, o.longitude])
      ];

      const polyline = L.polyline(points, {
        color: color,
        weight: isSelectedRoute ? 5 : (selectedRouteId ? 1.5 : 3.5),
        opacity: isSelectedRoute ? 0.95 : (selectedRouteId ? 0.3 : 0.75),
        dashArray: isSelectedRoute ? null : '6, 6'
      }).addTo(map);

      polylinesRef.current.push(polyline);

      // Add stop markers for each order
      groupOrders.forEach(order => {
        const isSelectedOrder = selectedOrderId === order.orderId;
        
        const stopMarkerHtml = `
          <div style="
            background-color: ${isSelectedOrder ? '#171A17' : color};
            color: #FFFFFF;
            width: ${isSelectedOrder ? '30px' : '24px'};
            height: ${isSelectedOrder ? '30px' : '24px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: ${isSelectedOrder ? '12px' : '10px'};
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            transition: all 0.2s ease;
          ">
            ${order.deliverySequence}
          </div>
        `;

        const stopIcon = L.divIcon({
          html: stopMarkerHtml,
          className: 'custom-stop-pin',
          iconSize: [isSelectedOrder ? 30 : 24, isSelectedOrder ? 30 : 24],
          iconAnchor: [isSelectedOrder ? 15 : 12, isSelectedOrder ? 15 : 12]
        });

        const statusBadgeBg = order.deliveryStatus === 'Delivered' ? '#DDE9DF' : 
                            (order.deliveryStatus === 'Failed' ? '#FEE2E2' : '#FEF3C7');
        const statusBadgeFg = order.deliveryStatus === 'Delivered' ? '#0B6B4B' : 
                            (order.deliveryStatus === 'Failed' ? '#991B1B' : '#92400E');

        const marker = L.marker([order.latitude, order.longitude], { icon: stopIcon })
          .bindPopup(`
            <div style="padding: 6px; font-family: sans-serif; min-width: 180px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-weight: 800; font-size: 13px; color: #171A17;">${order.orderId}</span>
                <span style="background: ${statusBadgeBg}; color: ${statusBadgeFg}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 99px;">${order.deliveryStatus}</span>
              </div>
              <div style="font-weight: 700; font-size: 12px; color: #0B6B4B; margin-bottom: 2px;">${order.consumerName}</div>
              <div style="font-size: 11px; color: #6B6D67; margin-bottom: 6px;">${order.address}</div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px solid #E6E4DC; padding-top: 4px;">
                <span>Qty: <b>${order.refillQuantity} Cylinder(s)</b></span>
                <span>ETA: <b>${order.estimatedDeliveryTime}</b></span>
              </div>
            </div>
          `)
          .addTo(map);

        marker.on('click', () => {
          setSelectedOrderId(order.orderId);
        });

        markersRef.current.push(marker);
      });
    });

  }, [depot, orders, routes, selectedRouteId, selectedOrderId]);

  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
      
      {/* Map Legend Overlay */}
      <div className="map-legend">
        <div className="legend-title">LPG ROUTE MAP LEGEND</div>
        <div className="legend-item">
          <span className="legend-depot">DEPOT</span>
          <span>LPG Distributor Depot</span>
        </div>
        <div className="legend-routes">
          {routes.slice(0, 4).map(r => (
            <div key={r.routeId} className="legend-route-tag">
              <span className="color-dot" style={{ backgroundColor: ROUTE_COLORS[r.routeId] }} />
              <span>{r.routeName} ({r.assignedVehicle})</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .map-legend {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          z-index: 400;
          font-size: 11px;
          box-shadow: var(--shadow-subtle);
          max-width: 260px;
        }

        .legend-title {
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-size: 9.5px;
          margin-bottom: 6px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .legend-depot {
          background: #171A17;
          color: #FFF;
          font-weight: 800;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 99px;
        }

        .legend-routes {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .legend-route-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
