import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import { 
  Truck, 
  User, 
  MapPin, 
  Clock, 
  Navigation, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ChevronRight,
  Eye,
  Calendar
} from 'lucide-react';

export default function RoutePlanningView() {
  const { 
    routes, 
    orders, 
    selectedRouteId, 
    setSelectedRouteId, 
    selectedOrderId,
    setSelectedOrderId,
    runRouteOptimization,
    updateOrderStatus
  } = useApp();

  const currentRoute = routes.find(r => r.routeId === selectedRouteId) || routes[0];

  // Route orders sorted by deliverySequence
  const routeOrders = orders
    .filter(o => o.assignedRoute === currentRoute.routeId)
    .sort((a, b) => a.deliverySequence - b.deliverySequence);

  return (
    <div className="route-planning-view">
      {/* View Header */}
      <div className="route-header-row">
        <div>
          <h1 className="page-title">Route Planning & GIS Optimization</h1>
          <p className="page-subtitle">
            Visual sequence timeline, capacity bounds, and real-time geographic dispatch
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={runRouteOptimization}
        >
          <Zap size={15} />
          <span>Re-Optimize Sequence</span>
        </button>
      </div>

      {/* Main Split Layout: Left Panel (Route Cards + Sequence) & Right Panel (GIS Map) */}
      <div className="route-planning-layout">
        
        {/* Left Side: Route Selector & Timeline Sequence */}
        <div className="route-left-panel">
          
          {/* Horizontal Route Selection Tabs */}
          <div className="route-tabs-scroll">
            {routes.map(r => {
              const isSelected = r.routeId === currentRoute.routeId;
              return (
                <button
                  key={r.routeId}
                  className={`route-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedRouteId(r.routeId)}
                >
                  <span className="tab-id">{r.routeId}</span>
                  <span className="tab-vehicle">{r.assignedVehicle}</span>
                </button>
              );
            })}
          </div>

          {/* Active Selected Route Detailed Card */}
          <div className="card route-main-card">
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <div>
                <span className="opt-status-tag">OPTIMIZED ROUTE</span>
                <h2 className="route-name-heading">{currentRoute.routeName}</h2>
              </div>
              <span className="route-id-badge">{currentRoute.routeId}</span>
            </div>

            <div className="route-spec-grid">
              <div className="spec-box">
                <span className="spec-lbl"><Truck size={12} /> VEHICLE</span>
                <span className="spec-val">{currentRoute.assignedVehicle}</span>
              </div>

              <div className="spec-box">
                <span className="spec-lbl"><User size={12} /> DRIVER</span>
                <span className="spec-val">{currentRoute.driver}</span>
              </div>

              <div className="spec-box">
                <span className="spec-lbl"><Flame size={12} /> CYLINDERS</span>
                <span className="spec-val">{currentRoute.totalCylinders} / {currentRoute.vehicleCapacity} ({currentRoute.capacityUtilization}%)</span>
              </div>

              <div className="spec-box">
                <span className="spec-lbl"><Navigation size={12} /> DISTANCE</span>
                <span className="spec-val">{currentRoute.totalDistance} km</span>
              </div>

              <div className="spec-box">
                <span className="spec-lbl"><Clock size={12} /> DURATION</span>
                <span className="spec-val">{currentRoute.totalRouteDuration}</span>
              </div>

              <div className="spec-box">
                <span className="spec-lbl"><Calendar size={12} /> SHIFT HOURS</span>
                <span className="spec-val">{currentRoute.startTime} – {currentRoute.expectedReturnTime}</span>
              </div>
            </div>

            {/* Area Flow Representation */}
            <div className="area-flow-bar">
              <span className="flow-lbl">AREA SEQUENCE:</span>
              <div className="flow-nodes">
                {currentRoute.areas.map((aId, idx) => (
                  <React.Fragment key={aId}>
                    <span className="flow-node">{aId}</span>
                    {idx < currentRoute.areas.length - 1 && <ChevronRight size={12} className="flow-arrow" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Sequence Timeline */}
          <div className="sequence-section">
            <div className="sequence-header">
              <h3 className="sequence-title">
                Delivery Stop Sequence ({routeOrders.length} Customers)
              </h3>
              <span className="start-depot-tag">00 / DEPOT DISPATCH (09:00 AM)</span>
            </div>

            <div className="timeline-list">
              {routeOrders.map((order, idx) => {
                const isSelected = selectedOrderId === order.orderId;
                const isDelivered = order.deliveryStatus === 'Delivered';
                const isFailed = order.deliveryStatus === 'Failed';

                return (
                  <div 
                    key={order.orderId}
                    className={`timeline-item ${isSelected ? 'selected' : ''} ${isDelivered ? 'delivered' : ''}`}
                    onClick={() => setSelectedOrderId(order.orderId)}
                  >
                    <div className="timeline-num-badge">
                      {String(order.deliverySequence).padStart(2, '0')}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-top">
                        <span className="cust-name">{order.consumerName}</span>
                        <span className="eta-badge">{order.estimatedDeliveryTime} AM</span>
                      </div>

                      <div className="timeline-address">
                        <MapPin size={11} />
                        <span>{order.address}</span>
                      </div>

                      <div className="timeline-footer">
                        <span className="qty-tag"><Flame size={11} /> {order.refillQuantity} Cyl</span>
                        <span className="dist-tag">+{order.distanceFromPreviousStop} km</span>
                        <span className="fifo-tag">FIFO #{order.fifoPriority}</span>
                        
                        <div className="status-chip-sm">
                          {order.deliveryStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Map Area */}
        <div className="route-right-panel">
          <div className="card map-full-card">
            <div className="map-toolbar">
              <div className="toolbar-info">
                <span className="toolbar-title">Route Visualizer</span>
                <span className="toolbar-sub">{currentRoute.routeName} • {currentRoute.assignedVehicle}</span>
              </div>
              <div className="toolbar-actions">
                <span className="live-status-pill">MAP LAYER LIVE</span>
              </div>
            </div>
            
            <div style={{ height: 'calc(100% - 48px)', minHeight: '520px' }}>
              <MapView 
                selectedRouteId={currentRoute.routeId}
                selectedOrderId={selectedOrderId}
                height="100%" 
              />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .route-planning-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: calc(100vh - 110px);
        }

        .route-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .route-planning-layout {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 20px;
          flex: 1;
          overflow: hidden;
        }

        .route-left-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .route-tabs-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .route-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          min-width: 100px;
          transition: all 0.15s ease;
        }

        .route-tab-btn:hover {
          background: var(--bg-main);
        }

        .route-tab-btn.active {
          background: var(--primary-accent);
          color: #FFFFFF;
          border-color: var(--primary-accent);
        }

        .tab-id {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
        }

        .tab-vehicle {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.85;
        }

        .route-main-card {
          background: #FFFFFF;
        }

        .opt-status-tag {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--primary-accent);
          background: var(--light-green);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .route-name-heading {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .route-id-badge {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          background: #ECEAE4;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .route-spec-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 12px;
        }

        .spec-box {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
        }

        .spec-lbl {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .spec-val {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .area-flow-bar {
          background: #FAF8F3;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
        }

        .flow-lbl {
          font-weight: 800;
          color: var(--text-muted);
        }

        .flow-nodes {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .flow-node {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--primary-accent);
        }

        .flow-arrow {
          color: var(--text-muted);
        }

        .sequence-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sequence-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sequence-title {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .start-depot-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--primary-accent);
          background: var(--light-green);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .timeline-item:hover {
          border-color: #B5B3A8;
          box-shadow: var(--shadow-subtle);
        }

        .timeline-item.selected {
          border-color: var(--primary-accent);
          background: #F7FAF8;
          box-shadow: 0 0 0 1px var(--primary-accent);
        }

        .timeline-item.delivered {
          opacity: 0.85;
          background: #FAF8F5;
        }

        .timeline-num-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-accent);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .cust-name {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .eta-badge {
          font-size: 11px;
          font-weight: 800;
          color: var(--primary-accent);
          background: var(--light-green);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .timeline-address {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .timeline-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          flex-wrap: wrap;
        }

        .qty-tag {
          display: flex;
          align-items: center;
          gap: 3px;
          background: #FFEDD5;
          color: #C2410C;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .dist-tag {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .fifo-tag {
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .status-chip-sm {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .route-right-panel {
          height: 100%;
        }

        .map-full-card {
          height: 100%;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .map-toolbar {
          height: 48px;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-color);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .toolbar-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .toolbar-sub {
          font-size: 11.5px;
          color: var(--text-secondary);
          margin-left: 8px;
        }

        .live-status-pill {
          font-size: 10px;
          font-weight: 800;
          background: var(--light-green);
          color: var(--primary-accent);
          padding: 3px 8px;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
}
