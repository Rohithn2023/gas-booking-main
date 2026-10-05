import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Route as RouteIcon, 
  Truck, 
  UserCheck, 
  Navigation, 
  BarChart3, 
  Sliders,
  CheckCircle2,
  Map
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, orders } = useApp();

  const pendingCount = orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Assigned').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package, badge: pendingCount },
    { id: 'areas', label: 'Areas', icon: MapPin },
    { id: 'routes', label: 'Route Planning', icon: RouteIcon },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: UserCheck },
    { id: 'execution', label: 'Delivery Execution', icon: Navigation, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-section-title">MAIN NAVIGATION</div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''} ${item.highlight ? 'driver-mode-link' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="link-left">
                <Icon size={17} className="sidebar-icon" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-card">
          <div className="status-header">
            <CheckCircle2 size={14} className="status-icon" />
            <span className="status-title">SYSTEM ONLINE</span>
          </div>
          <p className="status-desc">Local Optimization Engine Ready</p>
          <div className="depot-info">
            <Map size={12} />
            <span>Erode Central Depot</span>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 240px;
          background-color: #FFFFFF;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          height: calc(100vh - 64px);
        }

        .sidebar-section-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding: 0 10px 12px 10px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .link-left {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .sidebar-icon {
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-main);
        }

        .sidebar-link:hover .sidebar-icon {
          color: var(--text-primary);
        }

        .sidebar-link.active {
          color: #FFFFFF;
          background-color: var(--primary-accent);
        }

        .sidebar-link.active .sidebar-icon {
          color: #FFFFFF;
        }

        .driver-mode-link {
          border: 1px dashed var(--light-green-border);
          background-color: #F7FAF8;
        }

        .sidebar-link.active.driver-mode-link {
          border: 1px solid var(--primary-accent);
          background-color: var(--primary-accent);
        }

        .sidebar-badge {
          background-color: var(--light-green);
          color: var(--primary-accent);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 99px;
        }

        .sidebar-link.active .sidebar-badge {
          background-color: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }

        .sidebar-footer {
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .system-status-card {
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .status-icon {
          color: var(--primary-accent);
        }

        .status-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--primary-accent);
        }

        .status-desc {
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .depot-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
          padding-top: 6px;
          border-top: 1px dashed var(--border-color);
        }
      `}</style>
    </aside>
  );
}
