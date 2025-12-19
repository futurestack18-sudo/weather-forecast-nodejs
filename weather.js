const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
if (!OPENWEATHER_KEY) {
  console.warn('Warning: OPENWEATHER_API_KEY is not set. Put it in .env');
}

// Helper: call current weather and 5-day forecast
// Current: https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={key}
// Forecast: https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={key}
router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'city query parameter required' });

  try {
    const key = OPENWEATHER_KEY;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast`;

    // Parallel requests
    const [currentResp, forecastResp] = await Promise.all([
      axios.get(currentUrl, { params: { q: city, units: 'metric', appid: key } }),
      axios.get(forecastUrl, { params: { q: city, units: 'metric', appid: key } })
    ]);

    const current = currentResp.data;
    const forecast = forecastResp.data;

    // Format 5-day forecast: pick one forecast per day at 12:00 (if available), otherwise pick closest time
    const dailyMap = {};
    forecast.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const time = item.dt_txt.split(' ')[1];
      if (!dailyMap[date]) dailyMap[date] = [];
      dailyMap[date].push({ time, item });
    });

    const today = new Date().toISOString().split('T')[0];
    const forecastDays = Object.keys(dailyMap)
      .filter(d => d >= today) // today and future
      .slice(0, 5)
      .map(date => {
        // try to find 12:00 entry
        const entries = dailyMap[date];
        let chosen = entries.find(e => e.time === '12:00:00');
        if (!chosen) {
          // otherwise pick the entry closest to midday
          chosen = entries.reduce((prev, curr) => {
            const prevDiff = Math.abs(parseInt(prev.time.split(':')[0], 10) - 12);
            const currDiff = Math.abs(parseInt(curr.time.split(':')[0], 10) - 12);
            return currDiff < prevDiff ? curr : prev;
          });
        }
        const it = chosen.item;
        return {
          date,
          temp: it.main.temp,
          temp_min: it.main.temp_min,
          temp_max: it.main.temp_max,
          humidity: it.main.humidity,
          wind_speed: it.wind.speed,
          weather: it.weather && it.weather[0] ? {
            main: it.weather[0].main,
            description: it.weather[0].description,
            icon: it.weather[0].icon
          } : null
        };
      });

    const response = {
      city: {
        id: current.id,
        name: current.name,
        country: current.sys.country,
        coord: current.coord
      },
      current: {
        temp: current.main.temp,
        temp_min: current.main.temp_min,
        temp_max: current.main.temp_max,
        humidity: current.main.humidity,
        wind_speed: current.wind.speed,
        weather: current.weather && current.weather[0] ? {
          main: current.weather[0].main,
          description: current.weather[0].description,
          icon: current.weather[0].icon
        } : null
      },
      forecast: forecastDays
    };

    res.json(response);
  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status || 500).json({ error: err.response.data });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
