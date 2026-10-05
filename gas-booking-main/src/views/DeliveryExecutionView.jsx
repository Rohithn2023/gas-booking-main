import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Flame, 
  Clock, 
  Phone, 
  User, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function DeliveryExecutionView() {
  const { 
    orders, 
    routes, 
    vehicles, 
    updateOrderStatus, 
    driverActiveRouteId, 
    setDriverActiveRouteId 
  } = useApp();

  const activeRoute = routes.find(r => r.routeId === driverActiveRouteId) || routes[0];
  const vehicle = vehicles.find(v => v.vehicleNumber === activeRoute.assignedVehicle) || vehicles[0];

  // Route orders sorted by sequence
  const routeOrders = orders
    .filter(o => o.assignedRoute === activeRoute.routeId)
    .sort((a, b) => a.deliverySequence - b.deliverySequence);

  const completedCount = routeOrders.filter(o => o.deliveryStatus === 'Delivered').length;
  const failedCount = routeOrders.filter(o => o.deliveryStatus === 'Failed').length;
  const totalCount = routeOrders.length;
  const remainingCount = totalCount - completedCount - failedCount;

  // Find first non-delivered order as active current stop
  const currentStopIndex = routeOrders.findIndex(o => o.deliveryStatus !== 'Delivered' && o.deliveryStatus !== 'Failed');
  const activeStop = currentStopIndex !== -1 ? routeOrders[currentStopIndex] : null;

  const progressPct = totalCount > 0 ? Math.round(((completedCount + failedCount) / totalCount) * 100) : 100;

  const [navigationActive, setNavigationActive] = useState(false);

  return (
    <div className="driver-execution-container">
      
      {/* Driver Mobile Header Bar */}
      <div className="driver-app-header">
        <div className="header-top">
          <div className="brand-tag">
            <Navigation size={16} />
            <span>DRIVER DISPATCH APP</span>
          </div>
          
          {/* Route Selector for Prototype Testing */}
          <select 
            className="select-field route-switcher"
            value={driverActiveRouteId}
            onChange={(e) => setDriverActiveRouteId(e.target.value)}
          >
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>
                {r.routeId}: {r.assignedVehicle} ({r.driver})
              </option>
            ))}
          </select>
        </div>

        <h1 className="driver-screen-title">Today's Delivery Route</h1>

        <div className="driver-summary-cards">
          <div className="d-summary-box">
            <span className="d-lbl">VEHICLE</span>
            <span className="d-val mono-tag">{activeRoute.assignedVehicle}</span>
          </div>

          <div className="d-summary-box">
            <span className="d-lbl">DRIVER</span>
            <span className="d-val">{activeRoute.driver}</span>
          </div>

          <div className="d-summary-box">
            <span className="d-lbl">ROUTE ID</span>
            <span className="d-val mono-tag">{activeRoute.routeId}</span>
          </div>
        </div>

        {/* Progress Bar & Deliveries Counter */}
        <div className="route-progress-card">
          <div className="progress-text-row">
            <span className="p-title">ROUTE PROGRESS</span>
            <span className="p-count">
              <b>{completedCount}</b> / {totalCount} DELIVERIES COMPLETED
            </span>
          </div>
          <div className="driver-progress-bar">
            <div className="fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-details">
            <span>{remainingCount} Remaining</span>
            {failedCount > 0 && <span className="failed-text">{failedCount} Failed</span>}
          </div>
        </div>
      </div>

      {/* Main Body: Active Stop Card or All Done Screen */}
      <div className="driver-body">
        {activeStop ? (
          <div className="current-stop-card">
            <div className="stop-badge-header">
              <span className="stop-num-pill">
                STOP #{activeStop.deliverySequence} OF {totalCount}
              </span>
              <span className="eta-pill">
                <Clock size={12} /> ETA: {activeStop.estimatedDeliveryTime} AM
              </span>
            </div>

            <div className="customer-info-section">
              <div className="cust-label">CUSTOMER NAME</div>
              <h2 className="cust-name-heading">{activeStop.consumerName}</h2>

              <div className="info-row" style={{ marginTop: '10px' }}>
                <MapPin size={16} className="info-icon" />
                <div>
                  <div className="info-lbl">DELIVERY ADDRESS</div>
                  <div className="info-val">{activeStop.address}</div>
                </div>
              </div>

              <div className="info-row">
                <Phone size={16} className="info-icon" />
                <div>
                  <div className="info-lbl">CONTACT PHONE</div>
                  <a href={`tel:${activeStop.phone}`} className="phone-link">{activeStop.phone}</a>
                </div>
              </div>

              <div className="specs-two-col">
                <div className="spec-item">
                  <span className="s-lbl">REFILL QUANTITY</span>
                  <span className="s-val flame-val">
                    <Flame size={14} /> {activeStop.refillQuantity} Cylinders
                  </span>
                </div>

                <div className="spec-item">
                  <span className="s-lbl">DISTANCE FROM PREV</span>
                  <span className="s-val">{activeStop.distanceFromPreviousStop} KM</span>
                </div>
              </div>

              {activeStop.notes && (
                <div className="notes-box">
                  <span className="notes-lbl">SPECIAL INSTRUCTIONS / NOTES:</span>
                  <p className="notes-txt">"{activeStop.notes}"</p>
                </div>
              )}
            </div>

            {/* Navigation Active Alert */}
            {navigationActive && (
              <div className="nav-active-banner">
                <Navigation size={16} className="spin" />
                <span>GPS Navigation Active to {activeStop.areaName}...</span>
              </div>
            )}

            {/* Touch Friendly Action Buttons */}
            <div className="action-buttons-group">
              <button 
                className="touch-btn btn-nav"
                onClick={() => setNavigationActive(!navigationActive)}
              >
                <Navigation size={18} />
                <span>{navigationActive ? 'STOP NAVIGATION' : 'START NAVIGATION'}</span>
              </button>

              <div className="outcome-btn-row">
                <button 
                  className="touch-btn btn-delivered"
                  onClick={() => {
                    updateOrderStatus(activeStop.orderId, 'Delivered');
                    setNavigationActive(false);
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>DELIVERED</span>
                </button>

                <button 
                  className="touch-btn btn-failed"
                  onClick={() => {
                    updateOrderStatus(activeStop.orderId, 'Failed', 'Customer not reachable');
                    setNavigationActive(false);
                  }}
                >
                  <XCircle size={18} />
                  <span>FAILED</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="all-completed-card">
            <Sparkles size={36} className="sparkle-icon" />
            <h2>All Deliveries Completed!</h2>
            <p>Great job! Route {activeRoute.routeId} has finished all scheduled stops for today.</p>
            <span className="comp-stats">{completedCount} Cylinders Delivered successfully.</span>
          </div>
        )}

        {/* Upcoming Stops List */}
        <div className="upcoming-section">
          <h3 className="upcoming-title">Route Stop Manifest ({routeOrders.length} Stops)</h3>

          <div className="upcoming-list">
            {routeOrders.map(order => {
              const isCurrent = activeStop?.orderId === order.orderId;
              const isDelivered = order.deliveryStatus === 'Delivered';
              const isFailed = order.deliveryStatus === 'Failed';

              return (
                <div 
                  key={order.orderId}
                  className={`upcoming-item ${isCurrent ? 'is-current' : ''} ${isDelivered ? 'is-delivered' : ''}`}
                >
                  <div className="up-stop-num">{order.deliverySequence}</div>
                  <div className="up-info">
                    <span className="up-name">{order.consumerName}</span>
                    <span className="up-area">{order.address}</span>
                  </div>
                  <div className="up-meta">
                    <span className="up-eta">{order.estimatedDeliveryTime}</span>
                    <span className="up-status">{order.deliveryStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .driver-execution-container {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .driver-app-header {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 18px;
          box-shadow: var(--shadow-subtle);
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .brand-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: var(--primary-accent);
          letter-spacing: 0.05em;
        }

        .route-switcher {
          font-size: 11.5px;
          padding: 4px 8px;
        }

        .driver-screen-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .driver-summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .d-summary-box {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px;
          display: flex;
          flex-direction: column;
        }

        .d-lbl {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .d-val {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .route-progress-card {
          background: #FAF8F3;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .progress-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .p-title {
          font-weight: 800;
          color: var(--text-muted);
        }

        .p-count {
          font-weight: 700;
          color: var(--primary-accent);
        }

        .driver-progress-bar {
          height: 10px;
          background: #ECEAE4;
          border-radius: 5px;
          overflow: hidden;
        }

        .driver-progress-bar .fill {
          height: 100%;
          background: var(--primary-accent);
          transition: width 0.3s ease;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .failed-text {
          color: #991B1B;
          font-weight: 700;
        }

        .current-stop-card {
          background: #FFFFFF;
          border: 2px solid var(--primary-accent);
          border-radius: var(--radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stop-badge-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stop-num-pill {
          background: var(--primary-accent);
          color: #FFFFFF;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
        }

        .eta-pill {
          background: var(--light-green);
          color: var(--primary-accent);
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cust-label {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .cust-name-heading {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 8px;
        }

        .info-icon {
          color: var(--primary-accent);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .info-lbl {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .info-val {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .phone-link {
          font-size: 14px;
          font-weight: 800;
          color: var(--primary-accent);
          text-decoration: none;
        }

        .specs-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .spec-item {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px;
          display: flex;
          flex-direction: column;
        }

        .s-lbl {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .s-val {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .flame-val {
          color: #C2410C;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .notes-box {
          background: #FFFBEB;
          border: 1px solid #FCD34D;
          border-radius: var(--radius-sm);
          padding: 10px;
          font-size: 12px;
        }

        .notes-lbl {
          font-size: 10px;
          font-weight: 800;
          color: #92400E;
        }

        .notes-txt {
          color: #78350F;
          font-style: italic;
          margin-top: 2px;
        }

        .nav-active-banner {
          background: #E0F2FE;
          border: 1px solid #7DD3FC;
          color: #0369A1;
          border-radius: var(--radius-sm);
          padding: 10px;
          font-size: 12.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .touch-btn {
          width: 100%;
          height: 48px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .touch-btn:active {
          transform: scale(0.98);
        }

        .btn-nav {
          background: var(--text-primary);
          color: #FFFFFF;
        }

        .outcome-btn-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .btn-delivered {
          background: var(--primary-accent);
          color: #FFFFFF;
        }

        .btn-delivered:hover {
          background: var(--primary-hover);
        }

        .btn-failed {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        }

        .all-completed-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .sparkle-icon {
          color: var(--primary-accent);
        }

        .comp-stats {
          font-weight: 700;
          color: var(--primary-accent);
          background: var(--light-green);
          padding: 4px 12px;
          border-radius: 99px;
        }

        .upcoming-section {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .upcoming-title {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .upcoming-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .upcoming-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 12px;
        }

        .upcoming-item.is-current {
          background: var(--light-green);
          border-color: var(--primary-accent);
        }

        .upcoming-item.is-delivered {
          opacity: 0.6;
        }

        .up-stop-num {
          font-family: var(--font-mono);
          font-weight: 800;
          background: var(--bg-card);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .up-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .up-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .up-area {
          font-size: 10.5px;
          color: var(--text-secondary);
        }

        .up-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 10.5px;
        }

        .up-eta {
          font-weight: 700;
          color: var(--primary-accent);
        }

        .up-status {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
