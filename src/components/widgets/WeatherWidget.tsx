import React, { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  icon: string;
}

interface ForecastDay {
  date: Date;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  icon: string;
}

interface WeatherWidgetProps {
  location?: string;
  showForecast?: boolean;
  units?: 'celsius' | 'fahrenheit';
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  location = 'San Francisco, CA',
  showForecast = true,
  units = 'celsius',
}) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(units);

  // Mock weather data
  const generateMockWeather = (): WeatherData => {
    const conditions = [
      { name: 'Sunny', icon: '☀️' },
      { name: 'Partly Cloudy', icon: '⛅' },
      { name: 'Cloudy', icon: '☁️' },
      { name: 'Rainy', icon: '🌧️' },
      { name: 'Stormy', icon: '⛈️' },
      { name: 'Snowy', icon: '❄️' },
      { name: 'Foggy', icon: '🌫️' },
    ];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = selectedUnit === 'celsius' ? 22 : 72;
    const tempVariation = selectedUnit === 'celsius' ? 15 : 27;

    return {
      location,
      temperature: Math.round(baseTemp + (Math.random() - 0.5) * tempVariation),
      condition: condition.name,
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure: Math.round(1000 + Math.random() * 50),
      visibility: Math.round(5 + Math.random() * 15),
      uvIndex: Math.round(1 + Math.random() * 10),
      feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * tempVariation + Math.random() * 5),
      icon: condition.icon,
    };
  };

  const generateMockForecast = (): ForecastDay[] => {
    const conditions = [
      { name: 'Sunny', icon: '☀️' },
      { name: 'Partly Cloudy', icon: '⛅' },
      { name: 'Cloudy', icon: '☁️' },
      { name: 'Rainy', icon: '🌧️' },
      { name: 'Snowy', icon: '❄️' },
    ];

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const baseHigh = selectedUnit === 'celsius' ? 25 : 77;
      const baseLow = selectedUnit === 'celsius' ? 15 : 59;

      return {
        date,
        high: Math.round(baseHigh + (Math.random() - 0.5) * 10),
        low: Math.round(baseLow + (Math.random() - 0.5) * 10),
        condition: condition.name,
        precipitation: Math.round(Math.random() * 100),
        icon: condition.icon,
      };
    });
  };

  useEffect(() => {
    // Simulate API call delay
    setLoading(true);
    const timer = setTimeout(() => {
      setCurrentWeather(generateMockWeather());
      setForecast(generateMockForecast());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, selectedUnit]);

  // Update weather data every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentWeather(generateMockWeather());
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [selectedUnit]);

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'bg-green-500';
    if (uvIndex <= 5) return 'bg-yellow-500';
    if (uvIndex <= 7) return 'bg-orange-500';
    if (uvIndex <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Weather</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedUnit(selectedUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
            className="px-2 py-1 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
          >
            °{selectedUnit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{currentWeather.icon}</div>
        <div className="text-4xl font-bold mb-2">
          {currentWeather.temperature}°{selectedUnit === 'celsius' ? 'C' : 'F'}
        </div>
        <div className="text-lg opacity-90 mb-1">{currentWeather.condition}</div>
        <div className="text-sm opacity-75">{currentWeather.location}</div>
        <div className="text-sm opacity-75">
          Feels like {currentWeather.feelsLike}°{selectedUnit === 'celsius' ? 'C' : 'F'}
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <div className="text-xs opacity-75 mb-1">Humidity</div>
          <div className="text-lg font-semibold">{currentWeather.humidity}%</div>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <div className="text-xs opacity-75 mb-1">Wind</div>
          <div className="text-lg font-semibold">
            {currentWeather.windSpeed} km/h {currentWeather.windDirection}
          </div>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <div className="text-xs opacity-75 mb-1">Pressure</div>
          <div className="text-lg font-semibold">{currentWeather.pressure} hPa</div>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <div className="text-xs opacity-75 mb-1">Visibility</div>
          <div className="text-lg font-semibold">{currentWeather.visibility} km</div>
        </div>
      </div>

      {/* UV Index */}
      <div className="bg-white bg-opacity-20 p-3 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs opacity-75 mb-1">UV Index</div>
            <div className="text-lg font-semibold">{getUVIndexLabel(currentWeather.uvIndex)}</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{currentWeather.uvIndex}</span>
            <div
              className={`w-3 h-3 rounded-full ${getUVIndexColor(currentWeather.uvIndex)}`}
            ></div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {showForecast && (
        <div>
          <h4 className="text-lg font-semibold mb-4">7-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white bg-opacity-20 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{day.icon}</span>
                  <div>
                    <div className="font-medium">{formatDate(day.date)}</div>
                    <div className="text-xs opacity-75">{day.condition}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {day.high}°/{day.low}°
                  </div>
                  {day.precipitation > 0 && (
                    <div className="text-xs opacity-75">{day.precipitation}% rain</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-6 text-center text-xs opacity-75">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherWidget;
