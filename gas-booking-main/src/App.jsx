import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OptimizationModal from './components/OptimizationModal';

import DashboardView from './views/DashboardView';
import OrdersView from './views/OrdersView';
import AreaGroupingView from './views/AreaGroupingView';
import RoutePlanningView from './views/RoutePlanningView';
import VehicleAssignmentView from './views/VehicleAssignmentView';
import DeliveryExecutionView from './views/DeliveryExecutionView';
import AnalyticsView from './views/AnalyticsView';
import DriversView from './views/DriversView';
import SettingsView from './views/SettingsView';

import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

function AppContent() {
  const { activeTab, toasts } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'areas':
        return <AreaGroupingView />;
      case 'routes':
        return <RoutePlanningView />;
      case 'vehicles':
        return <VehicleAssignmentView />;
      case 'drivers':
        return <DriversView />;
      case 'execution':
        return <DeliveryExecutionView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="page-content">
          {renderActiveView()}
        </main>
      </div>

      {/* Optimization Workflow Modal */}
      <OptimizationModal />

      {/* Floating Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }

        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(23, 26, 23, 0.15);
          animation: slideInRight 0.25s ease-out;
        }

        .toast-item.success {
          background: #171A17;
          color: #FFFFFF;
          border-left: 4px solid var(--primary-accent);
        }

        .toast-item.warning {
          background: #FEF3C7;
          color: #92400E;
          border-left: 4px solid #F59E0B;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
