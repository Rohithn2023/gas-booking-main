import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Search, 
  Bell, 
  User, 
  Flame,
  LayoutDashboard,
  Package,
  Route as RouteIcon,
  Truck,
  BarChart3
} from 'lucide-react';

export default function Header() {
  const { 
    activeTab, 
    setActiveTab, 
    runRouteOptimization, 
    isOptimizing,
    kpis
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'routes', label: 'Routes', icon: RouteIcon },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
          <div className="flame-icon-wrapper">
            <Flame className="flame-icon" size={18} />
          </div>
          <div className="brand-text">
            <span className="brand-title">LPG Operations</span>
            <span className="brand-subtitle">Distributor Enterprise Platform</span>
          </div>
        </div>

        <nav className="header-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`header-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="header-right">
        <button 
          className="btn-primary optimize-cta"
          onClick={runRouteOptimization}
          disabled={isOptimizing}
        >
          <Zap size={15} className={isOptimizing ? 'spin' : ''} />
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize Routes'}</span>
        </button>

        <div className="header-user-menu">
          <button className="icon-btn" title="Notifications">
            <Bell size={17} />
            <span className="notification-dot" />
          </button>
          
          <div className="user-profile-badge">
            <div className="avatar">
              <User size={15} />
            </div>
            <div className="user-info">
              <span className="user-name">Depot Admin</span>
              <span className="user-role">Erode Depot #01</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .header-bar {
          height: 64px;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .flame-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--primary-accent);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .header-nav-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .header-nav-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-main);
        }

        .header-nav-btn.active {
          color: var(--primary-accent);
          background-color: var(--light-green);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .optimize-cta {
          box-shadow: 0 2px 8px rgba(11, 107, 75, 0.25);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .header-user-menu {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-left: 16px;
          border-left: 1px solid var(--border-color);
        }

        .icon-btn {
          position: relative;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .icon-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-main);
        }

        .notification-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--primary-accent);
          border: 1.5px solid #FFFFFF;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .user-role {
          font-size: 11px;
          color: var(--text-secondary);
        }
      `}</style>
    </header>
  );
}
