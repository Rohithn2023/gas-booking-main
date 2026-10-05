import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Clock, 
  Flame, 
  Truck, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function AnalyticsView() {
  const { orders, areas, vehicles, routes, kpis } = useApp();

  // 1. Orders by Area data
  const ordersByAreaData = areas.slice(0, 10).map(a => ({
    name: a.areaName.length > 12 ? a.areaName.slice(0, 10) + '...' : a.areaName,
    orders: a.totalOrders,
    cylinders: a.totalCylinders
  }));

  // 2. Orders by Hour data
  const hourlyData = [
    { hour: '06:30 AM', count: 18 },
    { hour: '07:00 AM', count: 42 },
    { hour: '07:30 AM', count: 65 },
    { hour: '08:00 AM', count: 48 },
    { hour: '08:30 AM', count: 27 }
  ];

  // 3. Vehicle Utilization data
  const vehicleUtilData = vehicles.slice(0, 8).map(v => ({
    vehicle: v.vehicleNumber.slice(-4),
    utilization: Math.round((v.currentLoad / v.capacity) * 100),
    cylinders: v.currentLoad
  }));

  // 4. Delivery Status Pie chart
  const statusPieData = [
    { name: 'Delivered', value: kpis.deliveredOrders, color: '#0B6B4B' },
    { name: 'Pending / Assigned', value: kpis.pendingOrders, color: '#F59E0B' },
    { name: 'Failed', value: kpis.failedOrders, color: '#EF4444' }
  ];

  return (
    <div className="analytics-view">
      {/* Page Header */}
      <div className="analytics-header">
        <div>
          <h1 className="page-title">Operational Analytics & Logistics Intelligence</h1>
          <p className="page-subtitle">
            Performance metrics, vehicle load efficiency, FIFO priority compliance, and spatial demand analytics
          </p>
        </div>

        <div className="fifo-compliance-card">
          <ShieldCheck size={20} className="shield-icon" />
          <div>
            <span className="comp-score">99.4%</span>
            <span className="comp-lbl">FIFO Compliance Index</span>
          </div>
        </div>
      </div>

      {/* Analytical KPI Summary Row */}
      <div className="analytics-summary-row">
        <div className="card summary-metric-card">
          <span className="metric-title">COMPLETED DELIVERIES</span>
          <span className="metric-num">{kpis.deliveredOrders} <span className="sub">/ {kpis.totalOrders}</span></span>
          <span className="metric-trend"><TrendingUp size={12} /> 66.0% Total Completion</span>
        </div>

        <div className="card summary-metric-card">
          <span className="metric-title">FLEET CAPACITY UTILIZATION</span>
          <span className="metric-num">{kpis.avgUtilization}%</span>
          <span className="metric-trend"><CheckCircle2 size={12} /> Target &gt;85% Achieved</span>
        </div>

        <div className="card summary-metric-card">
          <span className="metric-title">TOTAL ROUTE DISTANCE</span>
          <span className="metric-num">{kpis.totalDistance} <span className="sub">km</span></span>
          <span className="metric-trend">28.4 km Savings vs Naive Route</span>
        </div>

        <div className="card summary-metric-card">
          <span className="metric-title">AVG STOP SERVICE TIME</span>
          <span className="metric-num">5.2 <span className="sub">mins</span></span>
          <span className="metric-trend"><Clock size={12} /> Standard 5 min benchmark</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid-layout">
        
        {/* Chart 1: Orders by Area */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Refill Order Volume by Geographic Area</h3>
              <p className="card-subtitle">Top 10 Area Demand Distribution</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={ordersByAreaData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DC" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B6D67' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#6B6D67' }} />
                <Tooltip 
                  contentStyle={{ background: '#171A17', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#0B6B4B" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle Utilization Rate */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Vehicle Capacity Utilization (%)</h3>
              <p className="card-subtitle">Percentage payload filled out of 40 cylinder max</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={vehicleUtilData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DC" />
                <XAxis dataKey="vehicle" tick={{ fontSize: 11, fill: '#6B6D67' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B6D67' }} />
                <Tooltip 
                  contentStyle={{ background: '#171A17', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Utilization']}
                />
                <Bar dataKey="utilization" fill="#0B6B4B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Order Demand by Hour */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Refill Request Arrivals by Hour</h3>
              <p className="card-subtitle">Morning peak order influx timeline</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DC" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#6B6D67' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B6D67' }} />
                <Tooltip contentStyle={{ background: '#171A17', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="#0B6B4B" strokeWidth={3} dot={{ r: 5, fill: '#0B6B4B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Delivery Status Distribution Pie */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Delivery Completion Rate</h3>
              <p className="card-subtitle">Status breakdown of 200 orders</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 240, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie 
                  data={statusPieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={4}
                >
                  {statusPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#171A17', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pie-legend-col">
              {statusPieData.map(item => (
                <div key={item.name} className="legend-item-row">
                  <span className="p-dot" style={{ backgroundColor: item.color }} />
                  <span className="p-name">{item.name}:</span>
                  <span className="p-val"><b>{item.value}</b> ({Math.round(item.value / 200 * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .analytics-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fifo-compliance-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-subtle);
        }

        .shield-icon {
          color: var(--primary-accent);
        }

        .comp-score {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary-accent);
          display: block;
          line-height: 1;
        }

        .comp-lbl {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .analytics-summary-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .summary-metric-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
        }

        .metric-num {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .sub {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .metric-trend {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--primary-accent);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .charts-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .chart-card {
          background: #FFFFFF;
        }

        .pie-legend-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12px;
          width: 40%;
        }

        .legend-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .p-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .p-name {
          color: var(--text-secondary);
        }

        .p-val {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
