import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStats, useHistory, useESP32 } from '../hooks/useESP32';
import { TrendingUp, Activity, Database, Clock } from 'lucide-react';
import '../styles/Analytics.css';

function Analytics() {
  const { pollingEnabled } = useESP32();
  const { stats, loading } = useStats({ enabled: pollingEnabled });
  const { history } = useHistory(100, { enabled: pollingEnabled });

  if (!pollingEnabled) {
    return (
      <div className="analytics">
        <div className="loading">Connect to the ESP32 to view analytics.</div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="analytics">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  const statusData = [
    { name: 'Safe', value: stats.safeCount, color: '#10b981' },
    { name: 'Danger', value: stats.dangerCount, color: '#ef4444' }
  ];

  const averageData = [
    { name: 'Temperature', value: parseFloat(stats.avgTemp), max: parseFloat(stats.maxTemp), min: parseFloat(stats.minTemp), color: '#ef4444' },
    { name: 'Humidity', value: parseFloat(stats.avgHum), max: parseFloat(stats.maxHum), min: parseFloat(stats.minHum), color: '#3b82f6' },
    { name: 'Soil Moisture', value: parseFloat(stats.avgSoil), max: parseFloat(stats.maxSoil), min: parseFloat(stats.minSoil), color: '#10b981' }
  ];

  const statCards = [
    { title: 'Total Readings', value: stats.totalReadings, icon: Database, color: '#8b5cf6' },
    { title: 'Avg Temperature', value: `${stats.avgTemp}°C`, icon: TrendingUp, color: '#ef4444' },
    { title: 'Avg Humidity', value: `${stats.avgHum}%`, icon: Activity, color: '#3b82f6' },
    { title: 'Avg Soil', value: `${stats.avgSoil}%`, icon: Clock, color: '#10b981' }
  ];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p className="subtitle">Statistical insights and trends</p>
      </div>

      <div className="stats-cards">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="analytics-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="analytics-card-icon" style={{ background: `${card.color}20` }}>
              <card.icon size={24} color={card.color} />
            </div>
            <div>
              <p className="analytics-card-title">{card.title}</p>
              <h3 className="analytics-card-value" style={{ color: card.color }}>{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="charts-container">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Average, Min & Max Values</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={averageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="min" fill="#94a3b8" name="Min" />
              <Bar dataKey="value" fill="#3b82f6" name="Average" />
              <Bar dataKey="max" fill="#1e293b" name="Max" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className="insights-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Temperature Range</h4>
            <p>Min: {stats.minTemp}°C | Max: {stats.maxTemp}°C</p>
            <div className="range-bar">
              <div 
                className="range-fill" 
                style={{ 
                  width: `${(parseFloat(stats.avgTemp) / parseFloat(stats.maxTemp)) * 100}%`,
                  background: '#ef4444'
                }}
              />
            </div>
          </div>
          <div className="insight-card">
            <h4>Humidity Range</h4>
            <p>Min: {stats.minHum}% | Max: {stats.maxHum}%</p>
            <div className="range-bar">
              <div 
                className="range-fill" 
                style={{ 
                  width: `${(parseFloat(stats.avgHum) / 100) * 100}%`,
                  background: '#3b82f6'
                }}
              />
            </div>
          </div>
          <div className="insight-card">
            <h4>Soil Moisture Range</h4>
            <p>Min: {stats.minSoil}% | Max: {stats.maxSoil}%</p>
            <div className="range-bar">
              <div 
                className="range-fill" 
                style={{ 
                  width: `${(parseFloat(stats.avgSoil) / 100) * 100}%`,
                  background: '#10b981'
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Analytics;
