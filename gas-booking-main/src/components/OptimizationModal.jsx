import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  X,
  Sparkles
} from 'lucide-react';

export default function OptimizationModal() {
  const { 
    showOptimizationModal, 
    setShowOptimizationModal, 
    isOptimizing, 
    optimizationStep 
  } = useApp();

  if (!showOptimizationModal) return null;

  const stepsList = [
    { num: 1, title: '01 / ORDER COLLECTION', desc: 'Loaded 200 refill orders from local mock engine database.', icon: Layers },
    { num: 2, title: '02 / FIFO PRIORITY RANKING', desc: 'Ordered requests chronologically by order age & arrival timestamp.', icon: Clock },
    { num: 3, title: '03 / AREA GROUPING', desc: 'Clustered 20 geographic areas around Erode Distributor Depot.', icon: MapPin },
    { num: 4, title: '04 / CAPACITY & OPERATING HOURS', desc: 'Checked 40 cylinder max limit per vehicle & 9:00 AM–5:00 PM shift window.', icon: ShieldCheck },
    { num: 5, title: '05 / ROUTE OPTIMIZATION', desc: 'Minimizing total transit distance while respecting neighborhood clusters.', icon: Zap },
    { num: 6, title: '06 / VEHICLE & ETA GENERATION', desc: 'Assigned 8 active vehicles, computed stop sequences and ETAs.', icon: Truck }
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content optimization-modal-box">
        <div className="modal-header">
          <div className="header-title-group">
            <div className="opt-icon-badge">
              <Zap size={20} className={isOptimizing ? 'pulse' : ''} />
            </div>
            <div>
              <h3 className="modal-heading">Autonomous Route Optimization</h3>
              <p className="modal-subtext">LPG Delivery Planning Engine • 200 Orders • 20 Areas</p>
            </div>
          </div>
          {!isOptimizing && (
            <button className="close-btn" onClick={() => setShowOptimizationModal(false)}>
              <X size={18} />
            </button>
          )}
        </div>

        <div className="workflow-diagram">
          <div className="workflow-chips">
            <span className="chip">200 Orders</span>
            <ArrowRight size={12} />
            <span className="chip">FIFO Priority</span>
            <ArrowRight size={12} />
            <span className="chip">Area Grouping</span>
            <ArrowRight size={12} />
            <span className="chip">Capacity (40)</span>
            <ArrowRight size={12} />
            <span className="chip">Shift (9-5)</span>
            <ArrowRight size={12} />
            <span className="chip chip-active">ETAs Generated</span>
          </div>
        </div>

        <div className="steps-progress-list">
          {stepsList.map(s => {
            const Icon = s.icon;
            const isDone = s.num < optimizationStep || (!isOptimizing && optimizationStep === 6);
            const isCurrent = isOptimizing && s.num === optimizationStep;

            return (
              <div 
                key={s.num} 
                className={`step-item ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
              >
                <div className="step-indicator">
                  {isDone ? (
                    <CheckCircle2 size={18} className="check-icon" />
                  ) : isCurrent ? (
                    <div className="spinner-dot" />
                  ) : (
                    <span className="step-num">{s.num}</span>
                  )}
                </div>

                <div className="step-details">
                  <div className="step-header">
                    <span className="step-title">{s.title}</span>
                    {isCurrent && <span className="running-tag">PROCESSING</span>}
                    {isDone && <span className="done-tag">VERIFIED</span>}
                  </div>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!isOptimizing && (
          <div className="modal-footer">
            <div className="summary-banner">
              <Sparkles size={16} className="sparkle-icon" />
              <span>Optimization Complete: 8 Routes generated with 88% avg cylinder load factor!</span>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => setShowOptimizationModal(false)}
            >
              View Route Plan
            </button>
          </div>
        )}
      </div>

      <style>{`
        .optimization-modal-box {
          max-width: 680px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .opt-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background-color: var(--light-green);
          color: var(--primary-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse {
          animation: pulse 1.2s infinite alternate;
        }

        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        .modal-heading {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .modal-subtext {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .workflow-diagram {
          margin: 18px 0;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          overflow-x: auto;
        }

        .workflow-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .chip {
          padding: 3px 8px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-weight: 600;

        }

        .chip-active {
          background-color: var(--light-green);
          color: var(--primary-accent);
          border-color: var(--light-green-border);
        }

        .steps-progress-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: #FAF8F5;
          transition: all 0.2s ease;
        }

        .step-item.active {
          background: #FFFFFF;
          border-color: var(--primary-accent);
          box-shadow: 0 2px 10px rgba(11, 107, 75, 0.08);
        }

        .step-item.completed {
          background: #FFFFFF;
          border-color: var(--border-light);
        }

        .step-indicator {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-item.completed .step-indicator {
          background: var(--light-green);
          color: var(--primary-accent);
        }

        .step-item.active .step-indicator {
          background: var(--primary-accent);
          color: #FFFFFF;
        }

        .check-icon {
          color: var(--primary-accent);
        }

        .spinner-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #FFFFFF;
          animation: ping 1s infinite;
        }

        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }

        .step-details {
          flex: 1;
        }

        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .step-title {
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: var(--text-primary);
        }

        .running-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--primary-accent);
          letter-spacing: 0.05em;
        }

        .done-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .step-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 18px;
          border-top: 1px solid var(--border-color);
        }

        .summary-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--primary-accent);
        }
      `}</style>
    </div>
  );
}
