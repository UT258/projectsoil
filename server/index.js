import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;
const ESP32_URL = 'http://192.168.4.1';

// Store historical data
let dataHistory = [];
const MAX_HISTORY = 1000;

app.use(cors());
app.use(express.json());

// Proxy endpoint to fetch data from ESP32
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(`${ESP32_URL}/data`, {
      timeout: 5000
    });
    
    const data = {
      ...response.data,
      timestamp: new Date().toISOString()
    };
    
    // Store in history
    dataHistory.push(data);
    if (dataHistory.length > MAX_HISTORY) {
      dataHistory.shift();
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching ESP32 data:', error.message);
    res.status(503).json({ 
      error: 'ESP32 device not reachable',
      message: error.message,
      temp: '--',
      hum: '--',
      soil: '--',
      status: 'OFFLINE'
    });
  }
});

// Get historical data
app.get('/api/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const data = dataHistory.slice(-limit);
  res.json(data);
});

// Get statistics
app.get('/api/stats', (req, res) => {
  if (dataHistory.length === 0) {
    return res.json({
      avgTemp: 0,
      avgHum: 0,
      avgSoil: 0,
      minTemp: 0,
      maxTemp: 0,
      minHum: 0,
      maxHum: 0,
      minSoil: 0,
      maxSoil: 0,
      dangerCount: 0,
      safeCount: 0
    });
  }
  
  const temps = dataHistory.map(d => parseFloat(d.temp)).filter(v => !isNaN(v));
  const hums = dataHistory.map(d => parseFloat(d.hum)).filter(v => !isNaN(v));
  const soils = dataHistory.map(d => parseFloat(d.soil)).filter(v => !isNaN(v));
  
  const stats = {
    avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2),
    avgHum: (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(2),
    avgSoil: (soils.reduce((a, b) => a + b, 0) / soils.length).toFixed(2),
    minTemp: Math.min(...temps).toFixed(2),
    maxTemp: Math.max(...temps).toFixed(2),
    minHum: Math.min(...hums).toFixed(2),
    maxHum: Math.max(...hums).toFixed(2),
    minSoil: Math.min(...soils).toFixed(2),
    maxSoil: Math.max(...soils).toFixed(2),
    dangerCount: dataHistory.filter(d => d.status === 'DANGER').length,
    safeCount: dataHistory.filter(d => d.status === 'SAFE').length,
    totalReadings: dataHistory.length
  };
  
  res.json(stats);
});

// Clear history
app.delete('/api/history', (req, res) => {
  dataHistory = [];
  res.json({ message: 'History cleared' });
});

// Export data as CSV
app.get('/api/export', (req, res) => {
  if (dataHistory.length === 0) {
    return res.status(404).json({ error: 'No data to export' });
  }
  
  const csv = [
    'Timestamp,Temperature (°C),Humidity (%),Soil Moisture (%),Status',
    ...dataHistory.map(d => 
      `${d.timestamp},${d.temp},${d.hum},${d.soil},${d.status}`
    )
  ].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=esp32-data.csv');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to ESP32 at ${ESP32_URL}`);
});
