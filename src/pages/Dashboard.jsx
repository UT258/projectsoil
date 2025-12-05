import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Sprout, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Power } from 'lucide-react';
import { useESP32 } from '../hooks/useESP32';
import RealtimeChart from '../components/RealtimeChart';
import '../styles/Dashboard.css';

function Dashboard() {
  const { data, isConnected, error, pollingEnabled, connect, disconnect, refreshNow } = useESP32();

  const cards = [
    {
      title: 'Temperature',
      value: data.temp,
      unit: '°C',
      icon: Thermometer,
      color: '#ef4444',
      trend: '+2.3%'
    },
    {
      title: 'Humidity',
      value: data.hum,
      unit: '%',
      icon: Droplets,
      color: '#3b82f6',
      trend: '-1.2%'
    },
    {
      title: 'Soil Moisture',
      value: data.soil,
      unit: '%',
      icon: Sprout,
      color: '#10b981',
      trend: '+5.1%'
    },
    {
      title: 'Status',
      value: data.status,
      unit: '',
      icon: AlertTriangle,
      color: data.status === 'DANGER' ? '#ef4444' : '#10b981',
      trend: null
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Real-time monitoring of your ESP32 sensors</p>
        </div>
        <div className="dashboard-actions">
          <button
            className={`pill-btn ${pollingEnabled ? 'danger' : 'primary'}`}
            onClick={pollingEnabled ? disconnect : connect}
          >
            <Power size={16} />
            {pollingEnabled ? 'Disconnect' : 'Connect'}
          </button>
          <button className="pill-btn ghost" onClick={refreshNow}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        {(!isConnected || !pollingEnabled) && (
          <div className="error-banner">
            <AlertTriangle size={20} />
            <span>{pollingEnabled ? `Connection lost: ${error}` : 'Click Connect to start polling the ESP32'}</span>
          </div>
        )}
      </div>

      <div className="cards-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              <span className="card-title">{card.title}</span>
              <div className="card-icon" style={{ background: `${card.color}20` }}>
                <card.icon size={24} color={card.color} />
              </div>
            </div>
            <div className="card-body">
              <h2 className="card-value" style={{ color: card.color }}>
                {card.value}
                {card.unit && <span className="unit">{card.unit}</span>}
              </h2>
              {card.trend && (
                <div className="trend">
                  {card.trend.startsWith('+') ? (
                    <TrendingUp size={16} color="#10b981" />
                  ) : (
                    <TrendingDown size={16} color="#ef4444" />
                  )}
                  <span>{card.trend} from last hour</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid single">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Real-time Data</h3>
          <RealtimeChart />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
