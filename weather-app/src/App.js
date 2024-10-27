import React, { useState } from "react";
import {
  FaSun,
  FaCloudShowersHeavy,
  FaUmbrella,
  FaSnowflake,
} from "react-icons/fa";
import axios from "axios";

function WeatherApp() {
  const [location, setLocation] = useState("New York");
  const [currentCondition, setCurrentCondition] = useState({
    temp: 17,
    summary: "clear sky",
    icon: <FaSun className="text-yellow-500 text-7xl glowing-sun" />,
  });

  const [weeklyForecast, setWeeklyForecast] = useState([]);

  const fetchWeather = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=d46717fa2f228a7bd62d106fa4640ff4`
        );

        const forecastData = data.list;
        const todayWeather = forecastData[0];
        const todayIcon = getIcon(todayWeather.weather[0].main);

        setCurrentCondition({
          temp: todayWeather.main.temp,
          summary: todayWeather.weather[0].description,
          icon: todayIcon,
        });

        const forecastSummary = [];
        for (let i = 0; i < 4; i++) {
          const daily = forecastData[i * 8];
          forecastSummary.push({
            day: new Date(daily.dt * 1000).toLocaleDateString("en-US", {
              weekday: "long",
            }),
            temp: daily.main.temp,
            icon: getIcon(daily.weather[0].main),
          });
        }

        setWeeklyForecast(forecastSummary);
      } catch (err) {
        console.error("Error fetching weather data:", err.response ? err.response.data : err.message);
      }
    }
  };

  const getIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return <FaSun className="text-yellow-500 text-5xl glowing-sun" />;
      case "Clouds":
        return <FaCloudShowersHeavy className="text-gray-400 text-5xl cloudy" />;
      case "Rain":
        return <FaUmbrella className="text-blue-500 text-5xl rainy" />;
      case "Snow":
        return <FaSnowflake className="text-blue-300 text-5xl snowy" />;
      default:
        return <FaCloudShowersHeavy className="text-gray-400 text-5xl cloudy" />;
    }
  };

  return (
    <div
      className="bg-blue-400 min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/high/clouds-4k-730etvicfwa10vb0.webp')",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-40 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter a City..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={fetchWeather}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none text-center text-gray-700"
        />
        <div className="text-center mb-8">
          {currentCondition.icon}
          <h1 className="text-4xl font-bold text-gray-800 mt-2">{location}</h1>
          <p className="text-2xl text-gray-700">
            {currentCondition.temp}°C
          </p>
          <p className="text-md text-gray-600 capitalize">
            {currentCondition.summary}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {weeklyForecast.map((daily, idx) => (
            <div
              key={idx}
              className="p-2 bg-white bg-opacity-60 rounded-lg flex flex-col items-center"
            >
              <p className="font-medium text-gray-700">{daily.day}</p>
              {daily.icon}
              <p className="text-lg font-bold text-gray-800">{daily.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
