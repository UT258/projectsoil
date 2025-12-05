import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ESPContext = createContext(null);

export function ESP32Provider({ children }) {
  const [data, setData] = useState({
    temp: '--',
    hum: '--',
    soil: '--',
    status: 'IDLE',
    timestamp: null
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [pollingEnabled, setPollingEnabled] = useState(() => {
    const stored = localStorage.getItem('esp32-autoconnect');
    return stored === 'true';
  });
  const [refreshMs, setRefreshMs] = useState(() => {
    const stored = localStorage.getItem('esp32-refresh-ms');
    return stored ? Number(stored) : 1000;
  });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('esp32-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const pollingRef = useRef(null);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('esp32-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('esp32-autoconnect', pollingEnabled ? 'true' : 'false');
  }, [pollingEnabled]);

  useEffect(() => {
    localStorage.setItem('esp32-refresh-ms', String(refreshMs));
  }, [refreshMs]);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const json = await response.json();

        if (json.error) {
          if (!isCancelled) {
            setError(json.message);
            setIsConnected(false);
            setData((prev) => ({ ...prev, status: 'OFFLINE' }));
          }
        } else if (!isCancelled) {
          setData(json);
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setIsConnected(false);
          setData((prev) => ({ ...prev, status: 'OFFLINE' }));
        }
      }
    };

    if (pollingEnabled) {
      fetchData();
      pollingRef.current = setInterval(fetchData, refreshMs);
    } else {
      setIsConnected(false);
      setData((prev) => ({ ...prev, status: 'PAUSED' }));
    }

    return () => {
      isCancelled = true;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [pollingEnabled, refreshMs]);

  const refreshNow = async () => {
    try {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
      setIsConnected(!json.error);
      setError(json.error ? json.message : null);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    }
  };

  const value = useMemo(() => ({
    data,
    isConnected,
    error,
    pollingEnabled,
    refreshMs,
    setRefreshMs,
    connect: () => setPollingEnabled(true),
    disconnect: () => setPollingEnabled(false),
    refreshNow,
    theme,
    toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }), [data, isConnected, error, pollingEnabled, refreshMs, theme]);

  return (
    <ESPContext.Provider value={value}>
      {children}
    </ESPContext.Provider>
  );
}

export function useESP32() {
  const ctx = useContext(ESPContext);
  if (!ctx) {
    throw new Error('useESP32 must be used within ESP32Provider');
  }
  return ctx;
}

export function useHistory(limit = 100, { enabled = true } = {}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let isCancelled = false;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history?limit=${limit}`);
        const json = await response.json();
        if (!isCancelled) {
          setHistory(json);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [limit, enabled]);

  return { history, loading };
}

export function useStats({ enabled = true } = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let isCancelled = false;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const json = await response.json();
        if (!isCancelled) setStats(json);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [enabled]);

  return { stats, loading };
}
