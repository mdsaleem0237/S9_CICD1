import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Temperature = () => {

  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState("");

  const handleBtnClick = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setError("");
    setTemp(null);

    try {
      // 1️⃣ Get latitude & longitude
      const geoRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: city, count: 1 } }
      );

      if (!geoRes.data.results) {
        setError("City not found");
        return;
      }

      const { latitude, longitude } = geoRes.data.results[0];

      // 2️⃣ Get weather data
      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude,
            longitude,
            current_weather: true
          }
        }
      );

      setTemp(weatherRes.data.current_weather.temperature);

    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="head">
        <Link to="/">Main Page</Link>
        <Link to="/temperature">Weather Page</Link>
        <br />
        <h3>Welcome to API access via Axios - Weather Page</h3>
      </div>

      <br />

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          width: 300,
          height: 40,
          fontSize: 18,
          padding: 10
        }}
      />

      <br /><br />

      <button onClick={handleBtnClick} className="glass-btn">
        Proceed
      </button>

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {temp !== null && (
        <h1>Temperature in {city} is {temp} °C</h1>
      )}
    </div>
  );
};

export default Temperature;