import React from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, MapPin, Clock, ShieldCheck, Flame, Save } from 'lucide-react';

export default function SettingsView() {
  const { depot, runRouteOptimization } = useApp();

  return (
    <div className="settings-view">
      <div className="settings-header">
        <div>
          <h1 className="page-title">System Settings & Dispatch Parameters</h1>
          <p className="page-subtitle">
            Configure depot operating hours, vehicle capacity limits, default service time, and optimization rules
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <div className="card-header">
            <h3 className="card-title">Distributor Depot Configuration</h3>
          </div>
          <div className="setting-form-group">
            <label className="form-lbl">Depot Name</label>
            <input type="text" className="input-field" defaultValue={depot.name} />

            <label className="form-lbl">Hub Address</label>
            <input type="text" className="input-field" defaultValue={depot.address} />

            <div className="two-cols">
              <div>
                <label className="form-lbl">Latitude</label>
                <input type="text" className="input-field" defaultValue={depot.latitude} />
              </div>
              <div>
                <label className="form-lbl">Longitude</label>
                <input type="text" className="input-field" defaultValue={depot.longitude} />
              </div>
            </div>
          </div>
        </div>

        <div className="card settings-card">
          <div className="card-header">
            <h3 className="card-title">Dispatch Engine Parameters</h3>
          </div>
          <div className="setting-form-group">
            <label className="form-lbl">Operating Hours Window</label>
            <input type="text" className="input-field" defaultValue="09:00 AM – 05:00 PM" />

            <label className="form-lbl">Default Vehicle Capacity Limit</label>
            <input type="text" className="input-field" defaultValue="40 Cylinders / Truck" />

            <label className="form-lbl">Average Delivery Service Time</label>
            <input type="text" className="input-field" defaultValue="5 Minutes per Customer Stop" />

            <label className="form-lbl">Optimization Weight Priority</label>
            <input type="text" className="input-field" defaultValue="FIFO Order Age (60%) + Distance (40%)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <button className="btn-primary" onClick={runRouteOptimization}>
          <Save size={15} /> Save & Re-Optimize Routes
        </button>
      </div>

      <style>{`
        .settings-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .setting-form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-lbl {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
