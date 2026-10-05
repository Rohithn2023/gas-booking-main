import React, { createContext, useContext, useState, useMemo } from 'react';
import initialOrders from '../data/orders.json';
import initialAreas from '../data/areas.json';
import initialVehicles from '../data/vehicles.json';
import initialRoutes from '../data/routes.json';
import initialDrivers from '../data/drivers.json';
import depotData from '../data/depot.json';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(initialOrders);
  const [areas, setAreas] = useState(initialAreas);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [routes, setRoutes] = useState(initialRoutes);
  const [drivers, setDrivers] = useState(initialDrivers);
  const depot = depotData;

  const [selectedRouteId, setSelectedRouteId] = useState('ROUTE-01');
  const [selectedVehicleId, setSelectedVehicleId] = useState('VEH-01');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [driverActiveRouteId, setDriverActiveRouteId] = useState('ROUTE-01');

  // Optimization simulation state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState(0);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Update delivery status for an order
  const updateOrderStatus = (orderId, newStatus, notes = '') => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            deliveryStatus: newStatus,
            notes: notes || order.notes
          };
        }
        return order;
      });
    });

    addToast(`Order ${orderId} marked as ${newStatus}`, newStatus === 'Delivered' ? 'success' : 'warning');
  };

  // Run Route Optimization simulation
  const runRouteOptimization = () => {
    setShowOptimizationModal(true);
    setIsOptimizing(true);
    setOptimizationStep(1);

    const steps = [
      { step: 1, delay: 600 },  // FIFO Sorting
      { step: 2, delay: 1200 }, // Geographic Area Grouping
      { step: 3, delay: 1800 }, // Distance & Travel Duration
      { step: 4, delay: 2400 }, // Vehicle Capacity & Shift Constraints
      { step: 5, delay: 3000 }, // Delivery Sequencing & ETA calculation
      { step: 6, delay: 3600 }  // Final Assignment
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setOptimizationStep(step);
        if (step === 6) {
          setTimeout(() => {
            setIsOptimizing(false);
            // Re-assign some pending orders to demonstrate recalculation
            setOrders(prev => prev.map(o => {
              if (o.deliveryStatus === 'Pending') {
                return { ...o, deliveryStatus: 'Assigned' };
              }
              return o;
            }));
            addToast('Route Optimization Complete! All 200 orders sequenced.', 'success');
          }, 600);
        }
      }, delay);
    });
  };

  // KPIs computed from live state
  const kpis = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Assigned').length;
    const deliveredOrders = orders.filter(o => o.deliveryStatus === 'Delivered').length;
    const outForDelivery = orders.filter(o => o.deliveryStatus === 'Out for Delivery').length;
    const failedOrders = orders.filter(o => o.deliveryStatus === 'Failed').length;
    
    const activeVehiclesCount = vehicles.filter(v => v.status === 'Ready' && v.currentLoad > 0).length;
    const vehiclesRequiredCount = Math.ceil(orders.reduce((acc, o) => acc + o.refillQuantity, 0) / 40);
    const totalCylinders = orders.reduce((sum, o) => sum + o.refillQuantity, 0);

    const activeVehicles = vehicles.filter(v => v.currentLoad > 0);
    const avgUtilization = activeVehicles.length > 0
      ? Math.round(activeVehicles.reduce((sum, v) => sum + (v.currentLoad / v.capacity * 100), 0) / activeVehicles.length)
      : 0;

    const totalDistance = Number(routes.reduce((sum, r) => sum + r.totalDistance, 0).toFixed(1));
    const avgDeliveryTimeMinutes = 18.5; // average time per stop

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      outForDelivery,
      failedOrders,
      activeVehicles: activeVehiclesCount,
      vehiclesRequired: vehiclesRequiredCount,
      totalCylinders,
      avgUtilization,
      totalDistance,
      avgDeliveryTimeMinutes
    };
  }, [orders, vehicles, routes]);

  const value = {
    activeTab,
    setActiveTab,
    orders,
    areas,
    vehicles,
    routes,
    drivers,
    depot,
    selectedRouteId,
    setSelectedRouteId,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedOrderId,
    setSelectedOrderId,
    selectedAreaId,
    setSelectedAreaId,
    driverActiveRouteId,
    setDriverActiveRouteId,
    isOptimizing,
    optimizationStep,
    showOptimizationModal,
    setShowOptimizationModal,
    runRouteOptimization,
    updateOrderStatus,
    toasts,
    kpis
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
