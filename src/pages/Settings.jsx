import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save, Wifi, RefreshCw, Moon, SunMedium } from 'lucide-react';
import { useESP32 } from '../hooks/useESP32';
import '../styles/Settings.css';

function Settings() {
  const { refreshMs, setRefreshMs, pollingEnabled, connect, disconnect, theme, toggleTheme } = useESP32();
  const [settings, setSettings] = useState({
    esp32Url: 'http://192.168.4.1',
    refreshInterval: refreshMs,
    enableAlerts: true,
    tempThreshold: 30,
    humThreshold: 60,
    soilThreshold: 30,
    enableSound: false,
    darkMode: theme === 'dark',
    autoConnect: pollingEnabled
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('esp32Settings', JSON.stringify(settings));
    setRefreshMs(Number(settings.refreshInterval));
    if (settings.autoConnect) {
      connect();
    } else {
      disconnect();
    }
    if (settings.darkMode && theme !== 'dark') toggleTheme();
    if (!settings.darkMode && theme === 'dark') toggleTheme();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      localStorage.removeItem('esp32Settings');
      window.location.reload();
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="subtitle">Configure your ESP32 monitoring dashboard</p>
      </div>

      <div className="settings-container">
        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-header">
            <Wifi size={24} />
            <h2>Connection Settings</h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="esp32Url">ESP32 Device URL</label>
            <input
              type="text"
              id="esp32Url"
              name="esp32Url"
              value={settings.esp32Url}
              onChange={handleChange}
              placeholder="http://192.168.4.1"
            />
            <small>The local IP address of your ESP32 device</small>
          </div>

          <div className="form-group">
            <label htmlFor="refreshInterval">Refresh Interval (ms)</label>
            <input
              type="number"
              id="refreshInterval"
              name="refreshInterval"
              value={settings.refreshInterval}
              onChange={handleChange}
              min="100"
              max="10000"
              step="100"
            />
            <small>How often to fetch new data from the device</small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="autoConnect"
                checked={settings.autoConnect}
                onChange={(e) => setSettings((prev) => ({ ...prev, autoConnect: e.target.checked }))}
              />
              <span>Auto-connect on load</span>
            </label>
          </div>
        </motion.div>

        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <Bell size={24} />
            <h2>Alert Settings</h2>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableAlerts"
                checked={settings.enableAlerts}
                onChange={handleChange}
              />
              <span>Enable Alerts</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="tempThreshold">Temperature Threshold (°C)</label>
            <input
              type="number"
              id="tempThreshold"
              name="tempThreshold"
              value={settings.tempThreshold}
              onChange={handleChange}
              disabled={!settings.enableAlerts}
            />
            <small>Alert when temperature exceeds this value</small>
          </div>

          <div className="form-group">
            <label htmlFor="humThreshold">Humidity Threshold (%)</label>
            <input
              type="number"
              id="humThreshold"
              name="humThreshold"
              value={settings.humThreshold}
              onChange={handleChange}
              disabled={!settings.enableAlerts}
            />
            <small>Alert when humidity drops below this value</small>
          </div>

          <div className="form-group">
            <label htmlFor="soilThreshold">Soil Moisture Threshold (%)</label>
            <input
              type="number"
              id="soilThreshold"
              name="soilThreshold"
              value={settings.soilThreshold}
              onChange={handleChange}
              disabled={!settings.enableAlerts}
            />
            <small>Alert when soil moisture drops below this value</small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableSound"
                checked={settings.enableSound}
                onChange={handleChange}
                disabled={!settings.enableAlerts}
              />
              <span>Enable Sound Alerts</span>
            </label>
          </div>
        </motion.div>

        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <RefreshCw size={24} />
            <h2>Appearance</h2>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              <span>{settings.darkMode ? 'Dark Mode On' : 'Dark Mode Off'}</span>
            </label>
            <button
              className="inline-toggle"
              type="button"
              onClick={() => {
                toggleTheme();
                setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
              }}
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="settings-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button onClick={handleReset} className="btn btn-secondary">
            Reset to Default
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
