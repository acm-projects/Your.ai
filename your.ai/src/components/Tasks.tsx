import React, { useEffect, useState } from 'react';
import WeatherWidget from './WeatherWidget';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

const tasks: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=', {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        });

        const data = await response.json();

        const current = data.timelines.daily[0].values;

        setWeather({
          temperature: current.temperatureAvg,
          condition: current.weatherCodeMax.toString(),
          icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png',
        });

      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather data');
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="space-y-8">
      {/* ✅ Basic Weather Card */}
      <div className="bg-white p-4 rounded-lg shadow-md max-w-xs text-center">
        {weather ? (
          <>
            <img src={weather.icon} alt="weather icon" className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">{weather.temperature}°C</h2>
            <p className="text-gray-600 capitalize">{weather.condition}</p>
          </>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>

      {/* ✅ Tomorrow.io Forecast Widget */}
      <div>
        <h2 className="text-xl font-bold mb-2">Weather Forecast</h2>
        <WeatherWidget />
      </div>
    </div>
  );
};

export default tasks;
