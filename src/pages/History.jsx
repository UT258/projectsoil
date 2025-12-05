import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, RefreshCw, Calendar } from 'lucide-react';
import { useHistory, useESP32 } from '../hooks/useESP32';
import { format } from 'date-fns';
import '../styles/History.css';

function History() {
  const [limit, setLimit] = useState(100);
  const { pollingEnabled } = useESP32();
  const { history, loading } = useHistory(limit, { enabled: pollingEnabled });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `esp32-data-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await fetch('/api/history', { method: 'DELETE' });
        window.location.reload();
      } catch (error) {
        alert('Failed to clear history: ' + error.message);
      }
    }
  };

  return (
    <div className="history">
      <div className="history-header">
        <div>
          <h1>Data History</h1>
          <p className="subtitle">View and export historical sensor data</p>
        </div>
        <div className="history-actions">
          <select 
            value={limit} 
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="limit-select"
          >
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
            <option value={500}>Last 500</option>
            <option value={1000}>Last 1000</option>
          </select>
          <button onClick={handleExport} className="btn btn-primary">
            <Download size={16} />
            Export CSV
          </button>
          <button onClick={handleClearHistory} className="btn btn-danger">
            <Trash2 size={16} />
            Clear History
          </button>
        </div>
      </div>

      {!pollingEnabled ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar size={64} />
          <h3>Connect to start</h3>
          <p>Hit the Connect button to start pulling history from your ESP32.</p>
        </motion.div>
      ) : loading ? (
        <div className="loading">Loading history...</div>
      ) : history.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar size={64} />
          <h3>No Data Yet</h3>
          <p>Historical data will appear here as it's collected from your ESP32 device.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="history-table-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-label">Total Records:</span>
              <span className="stat-value">{history.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Latest Reading:</span>
              <span className="stat-value">
                {history.length > 0 && format(new Date(history[history.length - 1].timestamp), 'PPpp')}
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Soil Moisture</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.01, 1) }}
                  >
                    <td>{history.length - index}</td>
                    <td>{format(new Date(item.timestamp), 'PPpp')}</td>
                    <td className="temp-cell">{item.temp}°C</td>
                    <td className="hum-cell">{item.hum}%</td>
                    <td className="soil-cell">{item.soil}%</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default History;
