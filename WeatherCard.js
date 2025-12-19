import React from 'react';

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export default function WeatherCard({ data }) {
  const { city, current, forecast } = data;

  return (
    <div className="card" role="region" aria-label={`Weather for ${city.name}`}>
      <div className="top">
        <div className="city">
          <h2>{city.name}, {city.country}</h2>
          <small>Coordinates: {city.coord.lat}, {city.coord.lon}</small>
        </div>
        <div className="current">
          <div>
            <div className="temp">{Math.round(current.temp)}°C</div>
            <div className="meta">{current.weather?.description}</div>
          </div>
          {current.weather?.icon && (
            <img src={iconUrl(current.weather.icon)} alt={current.weather.description} />
          )}
        </div>
      </div>

      <div className="card-details">
        <div style={{display:'flex',gap:'18px',flexWrap:'wrap',marginTop:6}}>
          <div><strong>Humidity:</strong> {current.humidity}%</div>
          <div><strong>Wind:</strong> {current.wind_speed} m/s</div>
          <div><strong>Min:</strong> {Math.round(current.temp_min)}°C</div>
          <div><strong>Max:</strong> {Math.round(current.temp_max)}°C</div>
        </div>
      </div>

      {forecast && forecast.length > 0 && (
        <>
          <h3 style={{marginTop:12}}>5-day forecast</h3>
          <div className="forecast" role="list">
            {forecast.map((d) => (
              <div className="day" key={d.date} role="listitem">
                <div style={{fontWeight:600}}>{d.date}</div>
                {d.weather?.icon && (
                  <img src={iconUrl(d.weather.icon)} alt={d.weather.description} style={{width:64,height:64}} />
                )}
                <div style={{marginTop:6}}>{d.weather?.main}</div>
                <div style={{fontSize:14,marginTop:4}}>
                  {Math.round(d.temp)}°C
                </div>
                <div style={{color:'#6b7280',fontSize:13}}>H {Math.round(d.temp_max)} / L {Math.round(d.temp_min)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
