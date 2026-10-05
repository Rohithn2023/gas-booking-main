import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Award, Truck, CheckCircle2, Star } from 'lucide-react';

export default function DriversView() {
  const { drivers, vehicles } = useApp();

  return (
    <div className="drivers-view">
      <div className="drivers-header">
        <div>
          <h1 className="page-title">Driver Personnel Directory</h1>
          <p className="page-subtitle">
            Licensed delivery drivers, vehicle assignments, and service quality ratings
          </p>
        </div>
      </div>

      <div className="drivers-grid">
        {drivers.map(drv => {
          const assignedVeh = vehicles.find(v => v.driverId === drv.driverId);
          return (
            <div key={drv.driverId} className="card driver-card">
              <div className="driver-top">
                <div className="drv-avatar">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="drv-name">{drv.driverName}</h3>
                  <span className="drv-id-tag">{drv.driverId}</span>
                </div>
                <span className={`drv-status-badge ${drv.status.toLowerCase()}`}>
                  {drv.status}
                </span>
              </div>

              <div className="driver-specs">
                <div className="spec-row">
                  <Phone size={13} className="spec-icon" />
                  <span>{drv.phone}</span>
                </div>
                <div className="spec-row">
                  <Award size={13} className="spec-icon" />
                  <span>License: <b>{drv.license}</b> ({drv.experience})</span>
                </div>
                <div className="spec-row">
                  <Truck size={13} className="spec-icon" />
                  <span>Assigned Vehicle: <b>{assignedVeh ? assignedVeh.vehicleNumber : 'Unassigned'}</b></span>
                </div>
                <div className="spec-row">
                  <Star size={13} className="spec-icon" style={{ color: '#F59E0B' }} />
                  <span>Customer Rating: <b>{drv.rating} / 5.0 ★</b></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .drivers-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .driver-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .driver-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drv-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--light-green);
          color: var(--primary-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .drv-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .drv-id-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }

        .drv-status-badge {
          margin-left: auto;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 99px;
        }

        .drv-status-badge.active {
          background: var(--light-green);
          color: var(--primary-accent);
        }

        .drv-status-badge.standby {
          background: #FEF3C7;
          color: #92400E;
        }

        .driver-specs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
        }

        .spec-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
        }

        .spec-icon {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
