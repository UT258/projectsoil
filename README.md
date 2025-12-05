# 🌱 ESP32 Soil Monitor Dashboard

A professional, full-featured web dashboard for monitoring ESP32 soil sensors in real-time. Built with React, Node.js, and Three.js for stunning 3D visualizations.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-orange)

## ✨ Features

### 🎯 Core Features
- **Real-time Monitoring** - Live data updates every second from your ESP32 device
- **3D Visualizations** - Interactive 3D soil moisture visualization using Three.js
- **Advanced Analytics** - Statistical insights with charts and trends
- **Data History** - Complete historical data tracking and storage
- **CSV Export** - Export your data for external analysis
- **Alert System** - Configurable thresholds for temperature, humidity, and soil moisture
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

### 📊 Dashboard Views
1. **Dashboard** - Real-time sensor cards with trends and live charts
2. **Analytics** - Statistical analysis with bar charts, pie charts, and insights
3. **History** - Tabular view of all historical readings with export functionality
4. **Settings** - Configure alerts, thresholds, and connection parameters

### 🚀 Advanced Features
- Proxy server to handle CORS and communicate with ESP32
- Framer Motion animations for smooth UI transitions
- Recharts for professional data visualization
- React Three Fiber for 3D graphics
- Local storage for user preferences
- Dark mode ready (coming soon)

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **ESP32 device** running at `192.168.4.1` with the following endpoint:
  - `GET /data` - Returns JSON: `{ temp, hum, soil, status }`

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "d:\New folder (6)\projectsoil"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Option 1: Run Both Server and Client (Recommended)
```bash
npm run dev
```

This will start:
- **Proxy Server** on `http://localhost:5000`
- **React Client** on `http://localhost:3000`

### Option 2: Run Separately

**Start the proxy server:**
```bash
npm run server
```

**Start the React client (in a new terminal):**
```bash
npm run client
```

## 🌐 Accessing the Dashboard

Once running, open your browser and navigate to:
```
http://localhost:3000
```

## 🔧 Configuration

### ESP32 Setup
Ensure your ESP32 is:
1. Connected to the same network or running as an access point
2. Accessible at `http://192.168.4.1`
3. Providing a `/data` endpoint that returns:
   ```json
   {
     "temp": "25.5",
     "hum": "60",
     "soil": "45",
     "status": "SAFE"
   }
   ```

### Proxy Configuration
The proxy server is configured in `server/index.js`:
```javascript
const ESP32_URL = 'http://192.168.4.1';
```

Modify this if your ESP32 has a different IP address.

### Client Configuration
The client proxy is configured in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

## 📁 Project Structure

```
projectsoil/
├── server/
│   └── index.js              # Express proxy server
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Main layout with sidebar
│   │   ├── RealtimeChart.jsx # Live data charts
│   │   └── SoilVisualization3D.jsx # 3D soil visualization
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Analytics.jsx     # Analytics page
│   │   ├── History.jsx       # Data history
│   │   └── Settings.jsx      # Settings page
│   ├── hooks/
│   │   └── useESP32.js       # Custom hooks for data fetching
│   ├── styles/
│   │   ├── Layout.css
│   │   ├── Dashboard.css
│   │   ├── Analytics.css
│   │   ├── History.css
│   │   └── Settings.css
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 UI Features

### Dashboard
- Real-time sensor cards with color-coded values
- Live trend indicators
- Real-time line charts
- Interactive 3D soil moisture cylinder

### Analytics
- Statistical overview cards
- Bar charts for min/max/average values
- Pie chart for status distribution
- Range indicators with visual bars

### History
- Sortable data table
- Pagination support (50/100/500/1000 records)
- CSV export functionality
- Clear history option
- Formatted timestamps

### Settings
- ESP32 connection configuration
- Refresh interval adjustment
- Alert threshold customization
- Sound alert toggle
- Dark mode (coming soon)

## 🔌 API Endpoints

### Proxy Server Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/data` | GET | Fetch current sensor data from ESP32 |
| `/api/history` | GET | Get historical data (query: `?limit=100`) |
| `/api/stats` | GET | Get statistical analysis |
| `/api/export` | GET | Export data as CSV |
| `/api/history` | DELETE | Clear all historical data |

## 🛡️ Error Handling

The application handles:
- ESP32 device offline/unreachable
- Network timeout errors
- Invalid data responses
- CORS issues (handled by proxy)

When the ESP32 is offline, the dashboard displays:
- Connection status indicator in sidebar
- Error banner with details
- Offline status in data cards

## 🎯 Performance

- Efficient data fetching with 1-second intervals
- Optimized re-renders using React hooks
- Lightweight 3D rendering
- Responsive design with CSS Grid and Flexbox
- Smooth animations with Framer Motion

## 🔮 Future Enhancements

- [ ] Dark mode implementation
- [ ] Email/SMS alert notifications
- [ ] Multi-device support
- [ ] Data comparison tools
- [ ] Weather API integration
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time updates
- [ ] User authentication
- [ ] Cloud data backup

## 🐛 Troubleshooting

### ESP32 Not Connecting
1. Verify ESP32 IP address is `192.168.4.1`
2. Check if ESP32 web server is running
3. Ensure you're on the same network
4. Try accessing `http://192.168.4.1/data` directly in browser

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in server/index.js
const PORT = 5001;
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for ESP32 enthusiasts

## 🌟 Acknowledgments

- React & Vite for fast development
- Three.js for amazing 3D graphics
- Recharts for beautiful charts
- Lucide React for icons
- Framer Motion for animations

---

**Happy Monitoring! 🌱📊**
