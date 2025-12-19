import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { fetchWeatherByCity } from './services/weatherService';

export default function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (cityName) => {
    setCity(cityName);
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetchWeatherByCity(cityName);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Forecast</h1>
      </header>

      <main className="main">
        <SearchBar onSearch={handleSearch} />
        {loading && <div className="status">Loading...</div>}
        {error && <div className="status error">{error}</div>}
        {data && <WeatherCard data={data} />}
      </main>

      <footer className="footer">
        <small>Powered by OpenWeather</small>
      </footer>
    </div>
  );
}
