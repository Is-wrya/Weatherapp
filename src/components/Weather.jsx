import React, { useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    try {
      if (!city.trim()) {
        setError("Please enter a city name");
        return;
      }
      setError("");
      setWeatherData(null);

      // Step 1: Get coordinates from Open-Meteo Geocoding API
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Fetch weather from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        setError("Unable to fetch weather data");
        return;
      }

      const { temperature, windspeed, weathercode } = weatherData.current_weather;

      setWeatherData({
        name: `${name}, ${country}`,
        temperature,
        windspeed,
        weathercode,
        humidity: Math.floor(Math.random() * (90 - 40) + 40), // mock humidity
      });
    } catch (err) {
      console.error(err);
      setError("Unable to fetch weather data");
    }
  };

  const getWeatherIcon = (code) => {
    if ([0, 1].includes(code)) return clear_icon;
    if ([2].includes(code)) return cloud_icon;
    if ([3, 45, 48].includes(code)) return drizzle_icon;
    if ([51, 61, 63, 65, 80, 81, 82].includes(code)) return rain_icon;
    if ([71, 73, 75, 85, 86].includes(code)) return snow_icon;
    return cloud_icon;
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={search_icon} alt="search" onClick={getWeather} />
      </div>

      {error && <p style={{ color: "white" }}>{error}</p>}

      {weatherData && (
        <>
          <img
            src={getWeatherIcon(weatherData.weathercode)}
            alt="weather icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.name}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windspeed} km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
