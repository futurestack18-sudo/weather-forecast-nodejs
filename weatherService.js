// This calls the backend endpoint which in turn calls OpenWeather APIs.
// Frontend package.json has "proxy": "http://localhost:5000" so we can request /api/weather.

export async function fetchWeatherByCity(city) {
  const encoded = encodeURIComponent(city);
  const resp = await fetch(`/api/weather?city=${encoded}`);
  if (!resp.ok) {
    const body = await resp.json().catch(() => null);
    const msg = body && body.message ? body.message : body && body.error ? JSON.stringify(body.error) : resp.statusText;
    throw new Error(msg || 'Failed to fetch weather');
  }
  const data = await resp.json();
  return data;
}
