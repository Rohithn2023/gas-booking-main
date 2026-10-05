import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Flame, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function OrdersView() {
  const { 
    orders, 
    areas, 
    routes, 
    vehicles, 
    updateOrderStatus,
    setSelectedOrderId 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [routeFilter, setRouteFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('fifoPriority');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [detailModalOrder, setDetailModalOrder] = useState(null);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = 
        o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchArea = areaFilter === 'ALL' || o.areaId === areaFilter;
      const matchStatus = statusFilter === 'ALL' || o.deliveryStatus === statusFilter;
      const matchRoute = routeFilter === 'ALL' || o.assignedRoute === routeFilter;
      const matchVehicle = vehicleFilter === 'ALL' || o.assignedVehicle === vehicleFilter;

      return matchSearch && matchArea && matchStatus && matchRoute && matchVehicle;
    }).sort((a, b) => {
      if (sortBy === 'fifoPriority') return a.fifoPriority - b.fifoPriority;
      if (sortBy === 'orderTime') return a.orderTime.localeCompare(b.orderTime);
      if (sortBy === 'refillQty') return b.refillQuantity - a.refillQuantity;
      return 0;
    });
  }, [orders, searchTerm, areaFilter, statusFilter, routeFilter, vehicleFilter, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-pending"><span className="badge-dot" />Pending</span>;
      case 'Assigned':
        return <span className="badge badge-assigned"><span className="badge-dot" />Assigned</span>;
      case 'Out for Delivery':
        return <span className="badge badge-out-for-delivery"><span className="badge-dot" />Out for Delivery</span>;
      case 'Delivered':
        return <span className="badge badge-delivered"><span className="badge-dot" />Delivered</span>;
      case 'Failed':
        return <span className="badge badge-failed"><span className="badge-dot" />Failed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="orders-view">
      {/* Page Header */}
      <div className="orders-header">
        <div>
          <h1 className="page-title">Refill Order Management</h1>
          <p className="page-subtitle">
            Showing {filteredOrders.length} of {orders.length} total LPG refill orders with FIFO priority sequencing
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-chip">
            <span className="chip-num">{orders.filter(o => o.deliveryStatus === 'Delivered').length}</span>
            <span className="chip-lbl">Delivered</span>
          </div>
          <div className="stat-chip">
            <span className="chip-num">{orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Assigned').length}</span>
            <span className="chip-lbl">Pending / Assigned</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-card">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search Order ID, Consumer Name, Phone or Address..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-selects">
          <select 
            className="select-field" 
            value={areaFilter} 
            onChange={(e) => { setAreaFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All 20 Areas</option>
            {areas.map(a => (
              <option key={a.areaId} value={a.areaId}>{a.areaId}: {a.areaName}</option>
            ))}
          </select>

          <select 
            className="select-field" 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>

          <select 
            className="select-field" 
            value={routeFilter} 
            onChange={(e) => { setRouteFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Routes</option>
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>{r.routeId}: {r.routeName}</option>
            ))}
          </select>

          <select 
            className="select-field" 
            value={vehicleFilter} 
            onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Vehicles</option>
            {vehicles.map(v => (
              <option key={v.vehicleId} value={v.vehicleNumber}>{v.vehicleNumber} ({v.driverName})</option>
            ))}
          </select>

          <select 
            className="select-field" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fifoPriority">Sort: FIFO Priority</option>
            <option value="orderTime">Sort: Order Time</option>
            <option value="refillQty">Sort: Quantity</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Order ID</th>
              <th>Consumer</th>
              <th>Area</th>
              <th>Refill Qty</th>
              <th>Order Time</th>
              <th>Assigned Route</th>
              <th>Assigned Vehicle</th>
              <th>ETA</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order.orderId}>
                <td>
                  <span className="fifo-badge">P-{order.fifoPriority}</span>
                </td>
                <td className="mono-tag" style={{ fontWeight: 800 }}>{order.orderId}</td>
                <td>
                  <div className="consumer-cell">
                    <span className="c-name">{order.consumerName}</span>
                    <span className="c-phone">{order.phone}</span>
                  </div>
                </td>
                <td>
                  <div className="area-cell">
                    <span className="a-name">{order.areaName}</span>
                    <span className="a-id">{order.areaId}</span>
                  </div>
                </td>
                <td>
                  <span className="qty-pill">
                    <Flame size={12} /> {order.refillQuantity} Cyl
                  </span>
                </td>
                <td className="mono-tag">{order.orderTime}</td>
                <td>
                  <span className="route-tag">{order.assignedRoute}</span>
                </td>
                <td className="mono-tag">{order.assignedVehicle}</td>
                <td><b>{order.estimatedDeliveryTime}</b></td>
                <td>{getStatusBadge(order.deliveryStatus)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={() => setDetailModalOrder(order)}
                  >
                    <Eye size={12} /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-bar">
        <span className="pagination-info">
          Page <b>{currentPage}</b> of <b>{totalPages || 1}</b> ({filteredOrders.length} matching items)
        </span>
        <div className="pagination-btns">
          <button 
            className="btn-secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button 
            className="btn-secondary" 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Order Detail Modal */}
      {detailModalOrder && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-heading">Order {detailModalOrder.orderId} Details</h3>
                <p className="modal-subtext">Consumer Refill Order Specification</p>
              </div>
              <button className="close-btn" onClick={() => setDetailModalOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="order-detail-grid">
              <div className="detail-box">
                <span className="detail-lbl">Consumer Name</span>
                <span className="detail-val">{detailModalOrder.consumerName}</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Contact Phone</span>
                <span className="detail-val">{detailModalOrder.phone}</span>
              </div>

              <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                <span className="detail-lbl">Delivery Address</span>
                <span className="detail-val">{detailModalOrder.address}</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Area & Cluster</span>
                <span className="detail-val">{detailModalOrder.areaName} ({detailModalOrder.areaId})</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Refill Quantity</span>
                <span className="detail-val">{detailModalOrder.refillQuantity} Cylinder(s)</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">FIFO Priority Rank</span>
                <span className="detail-val">Priority #{detailModalOrder.fifoPriority}</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Order Time</span>
                <span className="detail-val">{detailModalOrder.orderTime} AM</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Assigned Vehicle</span>
                <span className="detail-val">{detailModalOrder.assignedVehicle}</span>
              </div>

              <div className="detail-box">
                <span className="detail-lbl">Estimated Arrival (ETA)</span>
                <span className="detail-val">{detailModalOrder.estimatedDeliveryTime} AM</span>
              </div>

              <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                <span className="detail-lbl">Delivery Notes</span>
                <span className="detail-val">{detailModalOrder.notes || 'None'}</span>
              </div>
            </div>

            <div className="status-update-bar">
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Quick Status Toggle:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => {
                    updateOrderStatus(detailModalOrder.orderId, 'Delivered');
                    setDetailModalOrder(prev => ({ ...prev, deliveryStatus: 'Delivered' }));
                  }}
                >
                  <CheckCircle2 size={13} /> Mark Delivered
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', color: '#991B1B' }}
                  onClick={() => {
                    updateOrderStatus(detailModalOrder.orderId, 'Failed', 'Customer unavailable');
                    setDetailModalOrder(prev => ({ ...prev, deliveryStatus: 'Failed' }));
                  }}
                >
                  <AlertTriangle size={13} /> Mark Failed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .orders-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-stats {
          display: flex;
          gap: 12px;
        }

        .stat-chip {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chip-num {
          font-size: 16px;
          font-weight: 800;
          color: var(--primary-accent);
        }

        .chip-lbl {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .filter-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding-left: 36px;
        }

        .clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .filter-selects {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .fifo-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          background: #ECEAE4;
          color: #171A17;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .consumer-cell {
          display: flex;
          flex-direction: column;
        }

        .c-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .c-phone {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .area-cell {
          display: flex;
          flex-direction: column;
        }

        .a-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .a-id {
          font-size: 10.5px;
          color: var(--text-muted);
        }

        .qty-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          background: #FFEDD5;
          color: #C2410C;
          padding: 2px 8px;
          border-radius: 99px;
        }

        .route-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary-accent);
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 4px;
        }

        .pagination-info {
          font-size: 12.5px;
          color: var(--text-secondary);
        }

        .pagination-btns {
          display: flex;
          gap: 8px;
        }

        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 18px 0;
        }

        .detail-box {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
        }

        .detail-lbl {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .detail-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .status-update-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}
