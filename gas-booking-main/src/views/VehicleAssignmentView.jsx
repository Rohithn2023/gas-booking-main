import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  User, 
  Flame, 
  Sliders, 
  ArrowRight, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';

export default function VehicleAssignmentView() {
  const { vehicles, routes, runRouteOptimization, isOptimizing, setActiveTab, setSelectedRouteId } = useApp();

  const activeVehicles = vehicles.filter(v => v.status === 'Ready');
  const standbyVehicles = vehicles.filter(v => v.status !== 'Ready');

  return (
    <div className="vehicle-assignment-view">
      {/* Page Header */}
      <div className="veh-header-row">
        <div>
          <h1 className="page-title">Vehicle Assignment & Capacity Planning</h1>
          <p className="page-subtitle">
            Manage cylinder payload limits, driver shift windows, and automated vehicle dispatch
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={runRouteOptimization}
          disabled={isOptimizing}
        >
          <Zap size={15} className={isOptimizing ? 'spin' : ''} />
          <span>{isOptimizing ? 'Re-Balancing...' : 'Optimize Assignment'}</span>
        </button>
      </div>

      {/* Vehicle Assignment Workflow Diagram Banner */}
      <div className="workflow-banner-card">
        <div className="banner-title-row">
          <span className="banner-badge">AUTOMATED DISPATCH WORKFLOW</span>
          <span className="banner-sub">6-Stage Optimization Loop</span>
        </div>

        <div className="workflow-pipeline">
          <div className="pipe-step">
            <span className="step-tag">01</span>
            <span className="step-txt">UNASSIGNED ORDERS</span>
          </div>
          <ArrowRight size={14} className="pipe-arrow" />

          <div className="pipe-step">
            <span className="step-tag">02</span>
            <span className="step-txt">CHECK CAPACITY</span>
          </div>
          <ArrowRight size={14} className="pipe-arrow" />

          <div className="pipe-step">
            <span className="step-tag">03</span>
            <span className="step-txt">CHECK AREA</span>
          </div>
          <ArrowRight size={14} className="pipe-arrow" />

          <div className="pipe-step">
            <span className="step-tag">04</span>
            <span className="step-txt">CHECK WORKING HOURS</span>
          </div>
          <ArrowRight size={14} className="pipe-arrow" />

          <div className="pipe-step">
            <span className="step-tag">05</span>
            <span className="step-txt">ASSIGN VEHICLE</span>
          </div>
          <ArrowRight size={14} className="pipe-arrow" />

          <div className="pipe-step active-step">
            <span className="step-tag">06</span>
            <span className="step-txt">FINAL OPTIMIZED ROUTE</span>
          </div>
        </div>
      </div>

      {/* Vehicles Grid Section */}
      <div className="veh-grid-section">
        <h2 className="section-title">Active Fleet Assignment ({activeVehicles.length} Vehicles Deployed)</h2>

        <div className="vehicles-cards-grid">
          {activeVehicles.map(veh => {
            const assignedRouteObj = routes.find(r => r.routeId === veh.routeId);
            const utilizationPct = Math.round((veh.currentLoad / veh.capacity) * 100);

            return (
              <div key={veh.vehicleId} className="card vehicle-card">
                <div className="veh-card-header">
                  <div>
                    <span className="veh-id-badge">{veh.vehicleId}</span>
                    <h3 className="veh-number">{veh.vehicleNumber}</h3>
                  </div>
                  <span className="status-badge-ready">
                    <CheckCircle2 size={12} /> {veh.status}
                  </span>
                </div>

                <div className="driver-row">
                  <div className="driver-avatar">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="driver-name-txt">{veh.driverName}</div>
                    <div className="driver-sub-txt">ID: {veh.driverId} • License Verified</div>
                  </div>
                </div>

                {/* Capacity Progress Bar Component */}
                <div className="capacity-box">
                  <div className="cap-header">
                    <span className="cap-label"><Flame size={12} /> CYLINDER CAPACITY</span>
                    <span className="cap-pct">{utilizationPct}% UTILIZATION</span>
                  </div>
                  <div className="cap-progress-bar">
                    <div 
                      className="cap-progress-fill" 
                      style={{ 
                        width: `${utilizationPct}%`,
                        backgroundColor: utilizationPct > 90 ? '#C2410C' : '#0B6B4B' 
                      }} 
                    />
                  </div>
                  <div className="cap-stats-row">
                    <span>Current Load: <b>{veh.currentLoad} / {veh.capacity} Cylinders</b></span>
                    <span>Orders: <b>{veh.assignedOrders}</b></span>
                  </div>
                </div>

                {/* Route & Distance Specs */}
                <div className="veh-specs-grid">
                  <div className="veh-spec-item">
                    <span className="v-lbl">ASSIGNED ROUTE</span>
                    <span className="v-val route-link-text">{veh.routeId || 'Unassigned'}</span>
                  </div>

                  <div className="veh-spec-item">
                    <span className="v-lbl">DISTANCE</span>
                    <span className="v-val">{veh.totalDistance} km</span>
                  </div>

                  <div className="veh-spec-item">
                    <span className="v-lbl">EST DURATION</span>
                    <span className="v-val">{veh.estimatedDuration}</span>
                  </div>

                  <div className="veh-spec-item">
                    <span className="v-lbl">SHIFT HOURS</span>
                    <span className="v-val">{veh.shiftStart} – {veh.shiftEnd}</span>
                  </div>
                </div>

                <div className="veh-card-footer">
                  <button 
                    className="btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      if (veh.routeId) {
                        setSelectedRouteId(veh.routeId);
                        setActiveTab('routes');
                      }
                    }}
                  >
                    Manage Route Dispatch <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standby / Maintenance Vehicles */}
      {standbyVehicles.length > 0 && (
        <div className="standby-section">
          <h2 className="section-title">Standby & Maintenance Vehicles ({standbyVehicles.length})</h2>
          
          <div className="standby-grid">
            {standbyVehicles.map(veh => (
              <div key={veh.vehicleId} className="card standby-card">
                <div className="veh-card-header">
                  <div>
                    <span className="veh-id-badge">{veh.vehicleId}</span>
                    <h3 className="veh-number">{veh.vehicleNumber}</h3>
                  </div>
                  <span className={`status-badge-${veh.status.toLowerCase()}`}>
                    {veh.status}
                  </span>
                </div>
                <div className="driver-row" style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Driver: <b>{veh.driverName}</b> • Capacity: <b>{veh.capacity} Cylinders</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .vehicle-assignment-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .veh-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .workflow-banner-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          box-shadow: var(--shadow-subtle);
        }

        .banner-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .banner-badge {
          background: var(--light-green);
          color: var(--primary-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .banner-sub {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .workflow-pipeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow-x: auto;
          gap: 8px;
          padding-bottom: 4px;
        }

        .pipe-step {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          white-space: nowrap;
        }

        .pipe-step.active-step {
          background: var(--light-green);
          border-color: var(--light-green-border);
          color: var(--primary-accent);
        }

        .step-tag {
          font-family: var(--font-mono);
          font-weight: 800;
          color: var(--text-muted);
        }

        .active-step .step-tag {
          color: var(--primary-accent);
        }

        .step-txt {
          font-weight: 700;
        }

        .pipe-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .vehicles-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .vehicle-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .veh-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .veh-id-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          background: #ECEAE4;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .veh-number {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .status-badge-ready {
          background: var(--light-green);
          color: var(--primary-accent);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .driver-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }

        .driver-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .driver-name-txt {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .driver-sub-txt {
          font-size: 10.5px;
          color: var(--text-secondary);
        }

        .capacity-box {
          background: #FAF8F5;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cap-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cap-pct {
          font-size: 11px;
          font-weight: 800;
          color: var(--primary-accent);
        }

        .cap-progress-bar {
          height: 8px;
          background: #ECEAE4;
          border-radius: 4px;
          overflow: hidden;
        }

        .cap-progress-fill {
          height: 100%;
          transition: width 0.4s ease;
        }

        .cap-stats-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        .veh-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .veh-spec-item {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
        }

        .v-lbl {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .v-val {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .route-link-text {
          font-family: var(--font-mono);
          color: var(--primary-accent);
        }

        .standby-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }

        .status-badge-standby {
          background: #FEF3C7;
          color: #92400E;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
        }

        .status-badge-maintenance {
          background: #FEE2E2;
          color: #991B1B;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
}
