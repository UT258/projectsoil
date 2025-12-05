import React from 'react';
import { motion } from 'framer-motion';
import { useESP32 } from '../hooks/useESP32';
import SoilVisualization3D from '../components/SoilVisualization3D';
import RealtimeChart from '../components/RealtimeChart';
import { Droplets, Thermometer, Sprout, Sparkles } from 'lucide-react';
import '../styles/Visualization.css';

function Visualization() {
  const { data, isConnected, pollingEnabled } = useESP32();
  const moisture = parseFloat(data.soil) || 0;

  const metrics = [
    { label: 'Temperature', value: `${data.temp}°C`, icon: Thermometer, color: '#ef4444' },
    { label: 'Humidity', value: `${data.hum}%`, icon: Droplets, color: '#3b82f6' },
    { label: 'Soil Moisture', value: `${data.soil}%`, icon: Sprout, color: '#10b981' },
    { label: 'Status', value: data.status, icon: Sparkles, color: data.status === 'DANGER' ? '#ef4444' : '#10b981' }
  ];

  return (
    <div className="visualization">
      <div className="visualization-header">
        <div>
          <h1>3D Visualizer</h1>
          <p className="subtitle">Immersive view of real-time soil health</p>
        </div>
        <div className={`viz-status ${isConnected && pollingEnabled ? 'live' : 'paused'}`}>
          <span className="dot" />
          {isConnected && pollingEnabled ? 'Live Data' : 'Waiting for connection'}
        </div>
      </div>

      <div className="visualization-grid">
        <motion.div
          className="visualization-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="visualization-3d">
            <SoilVisualization3D soilMoisture={moisture} />
          </div>
        </motion.div>

        <motion.div
          className="visualization-card side"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Live Metrics</h3>
          <div className="viz-metrics">
            {metrics.map((metric) => (
              <div key={metric.label} className="viz-metric">
                <div className="metric-icon" style={{ background: `${metric.color}20` }}>
                  <metric.icon size={18} color={metric.color} />
                </div>
                <div>
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value" style={{ color: metric.color }}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="visualization-card full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Live Signals</h3>
        <RealtimeChart />
      </motion.div>
    </div>
  );
}

export default Visualization;
