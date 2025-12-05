import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHistory, useESP32 } from '../hooks/useESP32';

function RealtimeChart() {
  const { pollingEnabled } = useESP32();
  const { history } = useHistory(50, { enabled: pollingEnabled });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const formatted = history.map((item, index) => ({
      index,
      temp: parseFloat(item.temp) || 0,
      hum: parseFloat(item.hum) || 0,
      soil: parseFloat(item.soil) || 0,
      time: new Date(item.timestamp).toLocaleTimeString()
    }));
    setChartData(formatted);
  }, [history]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="time" 
          stroke="#64748b"
          tick={{ fontSize: 12 }}
        />
        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temp" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={false}
          name="Temperature (°C)"
        />
        <Line 
          type="monotone" 
          dataKey="hum" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={false}
          name="Humidity (%)"
        />
        <Line 
          type="monotone" 
          dataKey="soil" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          name="Soil Moisture (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RealtimeChart;
