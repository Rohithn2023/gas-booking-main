import React from 'react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Sliders, 
  Flame, 
  Percent, 
  Navigation, 
  Timer, 
  ArrowUpRight,
  ChevronRight,
  Zap,
  MapPin,
  TrendingUp
} from 'lucide-react';

export default function DashboardView() {
  const { 
    kpis, 
    routes, 
    orders, 
    areas, 
    vehicles, 
    setActiveTab, 
    setSelectedRouteId,
    runRouteOptimization
  } = useApp();

  const activeRoutesList = routes.slice(0, 5);
  const topDemandAreas = [...areas].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 4);

  return (
    <div className="dashboard-view">
      {/* Page Title & Action Banner */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">LPG Delivery Operations</h1>
          <p className="page-subtitle">
            Monitor refill demand, route efficiency, vehicle utilization, and delivery execution.
          </p>
        </div>

        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => setActiveTab('routes')}
          >
            <Navigation size={15} />
            <span>Route Planning</span>
          </button>

          <button 
            className="btn-primary"
            onClick={runRouteOptimization}
          >
            <Zap size={15} />
            <span>Run Route Optimization</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (9 Metrics) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">TOTAL ORDERS</span>
            <div className="kpi-icon-wrap icon-green">
              <Package size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.totalOrders}</div>
          <div className="kpi-meta">
            <span className="meta-badge">100% Demand</span>
            <span>20 Geographic Areas</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">PENDING / ASSIGNED</span>
            <div className="kpi-icon-wrap icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.pendingOrders}</div>
          <div className="kpi-meta">
            <span className="meta-text">{kpis.outForDelivery} Out for delivery</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">ORDERS DELIVERED</span>
            <div className="kpi-icon-wrap icon-emerald">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.deliveredOrders}</div>
          <div className="kpi-meta">
            <span className="meta-badge-success">66% Completed</span>
            <span>{kpis.failedOrders} Failed</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">ACTIVE VEHICLES</span>
            <div className="kpi-icon-wrap icon-blue">
              <Truck size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.activeVehicles}</div>
          <div className="kpi-meta">
            <span>Fleet of 10 Vehicles</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">VEHICLES REQUIRED</span>
            <div className="kpi-icon-wrap icon-purple">
              <Sliders size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.vehiclesRequired}</div>
          <div className="kpi-meta">
            <span>Based on 40 cyl capacity</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">TOTAL CYLINDERS</span>
            <div className="kpi-icon-wrap icon-flame">
              <Flame size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.totalCylinders}</div>
          <div className="kpi-meta">
            <span>Domestic & Commercial</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">AVG VEHICLE UTILIZATION</span>
            <div className="kpi-icon-wrap icon-green">
              <Percent size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.avgUtilization}%</div>
          <div className="kpi-meta">
            <div className="mini-progress-bar">
              <div className="fill" style={{ width: `${kpis.avgUtilization}%` }} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">TOTAL ROUTE DISTANCE</span>
            <div className="kpi-icon-wrap icon-blue">
              <Navigation size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.totalDistance} <span className="unit">km</span></div>
          <div className="kpi-meta">
            <span>Optimized clustering</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">AVG DELIVERY TIME</span>
            <div className="kpi-icon-wrap icon-amber">
              <Timer size={16} />
            </div>
          </div>
          <div className="kpi-value">{kpis.avgDeliveryTimeMinutes} <span className="unit">min</span></div>
          <div className="kpi-meta">
            <span>Per cylinder stop</span>
          </div>
        </div>
      </div>

      {/* Operations Overview & Map Section */}
      <div className="dashboard-grid-layout">
        {/* Left Column: Map & Active Routes */}
        <div className="dash-left-column">
          <div className="card map-preview-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Live Dispatch & Geographic Route Clusters</h3>
                <p className="card-subtitle">Depot center: Erode • 20 Area Coverage</p>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveTab('routes')}
              >
                Expand Map <ArrowUpRight size={13} />
              </button>
            </div>
            <div style={{ height: '360px' }}>
              <MapView height="360px" />
            </div>
          </div>

          {/* Active Optimized Routes Table */}
          <div className="card routes-table-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Active Delivery Routes Summary</h3>
                <p className="card-subtitle">8 Vehicles deployed across 20 clusters</p>
              </div>
              <button 
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveTab('routes')}
              >
                View All Routes <ChevronRight size={13} />
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Route ID</th>
                    <th>Route Name</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Orders</th>
                    <th>Cylinders</th>
                    <th>Utilization</th>
                    <th>Distance</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRoutesList.map(r => (
                    <tr key={r.routeId}>
                      <td className="mono-tag" style={{ fontWeight: 700 }}>{r.routeId}</td>
                      <td style={{ fontWeight: 600 }}>{r.routeName}</td>
                      <td>{r.assignedVehicle}</td>
                      <td>{r.driver}</td>
                      <td><b>{r.totalOrders}</b></td>
                      <td><b>{r.totalCylinders} / {r.vehicleCapacity}</b></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '50px', height: '6px', background: '#ECEAE4', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${r.capacityUtilization}%`, height: '100%', background: '#0B6B4B' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>{r.capacityUtilization}%</span>
                        </div>
                      </td>
                      <td>{r.totalDistance} km</td>
                      <td>{r.totalRouteDuration}</td>
                      <td>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => {
                            setSelectedRouteId(r.routeId);
                            setActiveTab('routes');
                          }}
                        >
                          Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: High Demand Areas & FIFO Priority Stream */}
        <div className="dash-right-column">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Top Area Demand Clusters</h3>
                <p className="card-subtitle">Highest volume refill areas</p>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '6px 10px', fontSize: '11px' }}
                onClick={() => setActiveTab('areas')}
              >
                View 20 Areas
              </button>
            </div>

            <div className="area-demand-list">
              {topDemandAreas.map(area => (
                <div key={area.areaId} className="area-demand-item">
                  <div className="area-info">
                    <div className="area-pin-icon">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="area-name-text">{area.areaName}</div>
                      <div className="area-sub-text">{area.group} • Route: {area.assignedRoute}</div>
                    </div>
                  </div>
                  <div className="area-stats">
                    <span className="order-count-badge">{area.totalOrders} Orders</span>
                    <span className="cyl-text">{area.totalCylinders} Cylinders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Overview Card */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Operating Constraints Summary</h3>
            </div>
            
            <div className="constraints-list">
              <div className="constraint-box">
                <span className="box-title">Operating Shift Hours</span>
                <span className="box-val">09:00 AM – 05:00 PM</span>
              </div>
              <div className="constraint-box">
                <span className="box-title">Max Vehicle Load Limit</span>
                <span className="box-val">40 Cylinders / Truck</span>
              </div>
              <div className="constraint-box">
                <span className="box-title">Order Dispatch Strategy</span>
                <span className="box-val">FIFO Priority + Cluster</span>
              </div>
              <div className="constraint-box">
                <span className="box-title">Average Service Time</span>
                <span className="box-val">5 Mins / Customer Stop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .page-subtitle {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          width: 100%;
        }

        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          box-shadow: var(--shadow-subtle);
          min-width: 0;
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
        }

        .kpi-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-green { background: #DDE9DF; color: #0B6B4B; }
        .icon-amber { background: #FEF3C7; color: #92400E; }
        .icon-emerald { background: #D1FAE5; color: #047857; }
        .icon-blue { background: #E0F2FE; color: #0369A1; }
        .icon-purple { background: #F3E8FF; color: #6B21A8; }
        .icon-flame { background: #FFEDD5; color: #C2410C; }

        .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          margin: 6px 0 4px 0;
          line-height: 1;
        }

        .unit {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .kpi-meta {
          font-size: 11.5px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-badge {
          background: #ECEAE4;
          color: #171A17;
          font-weight: 700;
          font-size: 10.5px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .meta-badge-success {
          background: #DDE9DF;
          color: #0B6B4B;
          font-weight: 700;
          font-size: 10.5px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .mini-progress-bar {
          width: 100%;
          height: 6px;
          background: #ECEAE4;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
        }

        .mini-progress-bar .fill {
          height: 100%;
          background: var(--primary-accent);
        }

        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 20px;
          min-width: 0;
          max-width: 100%;
        }

        .dash-left-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
          max-width: 100%;
        }

        .dash-right-column {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        @media (max-width: 1180px) {
          .dashboard-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .area-demand-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .area-demand-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }

        .area-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .area-pin-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--light-green);
          color: var(--primary-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .area-name-text {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .area-sub-text {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .area-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .order-count-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary-accent);
          background: var(--light-green);
          padding: 2px 8px;
          border-radius: 99px;
        }

        .cyl-text {
          font-size: 10.5px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .constraints-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .constraint-box {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px;
          display: flex;
          flex-direction: column;
        }

        .box-title {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .box-val {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
