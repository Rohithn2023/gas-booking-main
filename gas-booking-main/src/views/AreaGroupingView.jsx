import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Layers, 
  ArrowRight, 
  Truck, 
  Flame, 
  Navigation, 
  Compass, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function AreaGroupingView() {
  const { areas, routes, vehicles, setActiveTab, setSelectedRouteId } = useApp();

  const [selectedCluster, setSelectedCluster] = useState('ALL');

  // Group areas by assignedRoute / group
  const clusterGroups = [
    { id: 'GROUP-A', name: 'AREA GROUP A (North Cluster)', routeId: 'ROUTE-01', areaIds: ['AREA-01', 'AREA-02', 'AREA-05'] },
    { id: 'GROUP-B', name: 'AREA GROUP B (Far North Cluster)', routeId: 'ROUTE-02', areaIds: ['AREA-03', 'AREA-04', 'AREA-17'] },
    { id: 'GROUP-C', name: 'AREA GROUP C (East Central Cluster)', routeId: 'ROUTE-03', areaIds: ['AREA-06', 'AREA-07', 'AREA-08'] },
    { id: 'GROUP-D', name: 'AREA GROUP D (South Metro Ring)', routeId: 'ROUTE-04', areaIds: ['AREA-09', 'AREA-12', 'AREA-20'] },
    { id: 'GROUP-E', name: 'AREA GROUP E (Far South Cluster)', routeId: 'ROUTE-05', areaIds: ['AREA-10', 'AREA-11'] },
    { id: 'GROUP-F', name: 'AREA GROUP F (West Suburban Cluster)', routeId: 'ROUTE-06', areaIds: ['AREA-13', 'AREA-14', 'AREA-15'] },
    { id: 'GROUP-G', name: 'AREA GROUP G (Far West Outer Express)', routeId: 'ROUTE-07', areaIds: ['AREA-16'] },
    { id: 'GROUP-H', name: 'AREA GROUP H (East Outer Riverfront)', routeId: 'ROUTE-08', areaIds: ['AREA-18', 'AREA-19'] }
  ];

  return (
    <div className="area-grouping-view">
      {/* Page Header */}
      <div className="area-header">
        <div>
          <h1 className="page-title">Geographic Area Grouping</h1>
          <p className="page-subtitle">
            20 Geographic delivery zones clustered into 8 optimal delivery routes around LPG Distributor Depot
          </p>
        </div>

        <div className="cluster-filter-pills">
          <button 
            className={`pill-btn ${selectedCluster === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCluster('ALL')}
          >
            All 20 Areas
          </button>
          {clusterGroups.map(grp => (
            <button 
              key={grp.id}
              className={`pill-btn ${selectedCluster === grp.id ? 'active' : ''}`}
              onClick={() => setSelectedCluster(grp.id)}
            >
              {grp.id}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Area Grouping Flowchart Cards */}
      <div className="cluster-flow-section">
        <h2 className="section-title">Geographic Proximity Grouping Workflow</h2>
        
        <div className="cluster-flow-grid">
          {clusterGroups
            .filter(grp => selectedCluster === 'ALL' || selectedCluster === grp.id)
            .map(grp => {
              const groupRoute = routes.find(r => r.routeId === grp.routeId);
              const groupAreas = areas.filter(a => grp.areaIds.includes(a.areaId));
              const totalOrdersInGrp = groupAreas.reduce((sum, a) => sum + a.totalOrders, 0);
              const totalCylsInGrp = groupAreas.reduce((sum, a) => sum + a.totalCylinders, 0);

              return (
                <div key={grp.id} className="cluster-card">
                  <div className="cluster-header">
                    <div className="cluster-title-wrap">
                      <span className="cluster-badge">{grp.id}</span>
                      <span className="cluster-name">{grp.name}</span>
                    </div>
                    <span className="cluster-meta-orders">{totalOrdersInGrp} Orders ({totalCylsInGrp} Cylinders)</span>
                  </div>

                  <div className="area-nodes-row">
                    {groupAreas.map(a => (
                      <div key={a.areaId} className="area-node-chip">
                        <MapPin size={12} className="node-icon" />
                        <span className="node-id">{a.areaId}</span>
                        <span className="node-name">{a.areaName}</span>
                      </div>
                    ))}
                  </div>

                  <div className="route-flow-arrow">
                    <ArrowRight size={16} className="arrow-down" />
                    <span>OPTIMIZED ROUTE CLUSTER ASSIGNMENT</span>
                  </div>

                  <div className="assigned-route-box">
                    <div className="route-left">
                      <div className="route-id-tag">{grp.routeId}</div>
                      <div>
                        <div className="route-name-txt">{groupRoute?.routeName || 'Assigned Route'}</div>
                        <div className="route-sub-txt">Vehicle: <b>{groupRoute?.assignedVehicle}</b> • Driver: <b>{groupRoute?.driver}</b></div>
                      </div>
                    </div>

                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => {
                        setSelectedRouteId(grp.routeId);
                        setActiveTab('routes');
                      }}
                    >
                      View Route Sequence <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Grid of All 20 Individual Area Cards */}
      <div className="areas-grid-section">
        <h2 className="section-title">All 20 Geographic Area Profiles</h2>

        <div className="areas-grid">
          {areas.map(area => (
            <div key={area.areaId} className="card area-profile-card">
              <div className="area-card-top">
                <div className="area-tag-group">
                  <span className="area-id-pill">{area.areaId}</span>
                  <h3 className="area-title">{area.areaName}</h3>
                </div>
                <span className="priority-badge">Priority High</span>
              </div>

              <div className="area-group-label">{area.group}</div>

              <div className="area-metrics-row">
                <div className="metric">
                  <span className="m-val">{area.totalOrders}</span>
                  <span className="m-lbl">Orders</span>
                </div>
                <div className="metric">
                  <span className="m-val">{area.totalCylinders}</span>
                  <span className="m-lbl">Cylinders</span>
                </div>
                <div className="metric">
                  <span className="m-val">{area.avgDistance} km</span>
                  <span className="m-lbl">Avg Radius</span>
                </div>
              </div>

              <div className="nearest-areas-box">
                <span className="nearest-lbl">Nearest Adjacent Areas:</span>
                <div className="nearest-tags">
                  {area.nearestAreas.map(n => (
                    <span key={n} className="n-tag">{n}</span>
                  ))}
                </div>
              </div>

              <div className="area-assignment-footer">
                <div className="assign-info">
                  <Truck size={13} />
                  <span>Route: <b>{area.assignedRoute}</b> ({area.assignedVehicle})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .area-grouping-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .area-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cluster-filter-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pill-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pill-btn:hover {
          color: var(--text-primary);
          background: var(--bg-main);
        }

        .pill-btn.active {
          background: var(--primary-accent);
          color: #FFFFFF;
          border-color: var(--primary-accent);
        }

        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }

        .cluster-flow-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cluster-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 18px 22px;
          box-shadow: var(--shadow-subtle);
        }

        .cluster-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .cluster-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cluster-badge {
          background: #ECEAE4;
          color: #171A17;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .cluster-name {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .cluster-meta-orders {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary-accent);
        }

        .area-nodes-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .area-node-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }

        .node-icon {
          color: var(--primary-accent);
        }

        .node-id {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .node-name {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .route-flow-arrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin: 8px 0;
        }

        .arrow-down {
          color: var(--primary-accent);
        }

        .assigned-route-box {
          background: var(--light-green);
          border: 1px solid var(--light-green-border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .route-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .route-id-tag {
          background: var(--primary-accent);
          color: #FFFFFF;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .route-name-txt {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .route-sub-txt {
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .area-profile-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .area-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .area-tag-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .area-id-pill {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          background: #ECEAE4;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .area-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .priority-badge {
          font-size: 10px;
          font-weight: 700;
          background: #FEF3C7;
          color: #92400E;
          padding: 2px 6px;
          border-radius: 99px;
        }

        .area-group-label {
          font-size: 11.5px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .area-metrics-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px;
          text-align: center;
        }

        .metric {
          display: flex;
          flex-direction: column;
        }

        .m-val {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .m-lbl {
          font-size: 10px;
          color: var(--text-muted);
        }

        .nearest-areas-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nearest-lbl {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .nearest-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .n-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .area-assignment-footer {
          padding-top: 8px;
          border-top: 1px solid var(--border-light);
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        .assign-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
