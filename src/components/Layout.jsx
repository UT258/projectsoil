import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Settings, 
  Menu, 
  X,
  Wifi,
  WifiOff,
  Power,
  Moon,
  SunMedium,
  Box
} from 'lucide-react';
import { useESP32 } from '../hooks/useESP32';
import '../styles/Layout.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isConnected, pollingEnabled, connect, disconnect, theme, toggleTheme } = useESP32();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/visual', icon: Box, label: '3D Visuals' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">🌱 ESP32 Monitor</h1>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-actions">
            <button
              className={`control-btn ${pollingEnabled ? 'danger' : 'primary'}`}
              onClick={pollingEnabled ? disconnect : connect}
            >
              {pollingEnabled ? <Power size={16} /> : <Wifi size={16} />}
              {sidebarOpen && (pollingEnabled ? 'Disconnect' : 'Connect')}
            </button>

            <button
              className="control-btn ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              {sidebarOpen && (theme === 'dark' ? 'Light' : 'Dark')}
            </button>
          </div>

          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            {sidebarOpen && (
              <span>{isConnected ? 'Connected' : 'Offline'}</span>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
