import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, Calendar, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    tempMin: number;
    tempMax: number;
    humidity: number;
    precipitation: number;
    description: string;
    icon: string;
  }>;
  location: string;
}

interface WeatherCalendarProps {
  lat: number;
  lon: number;
  locationName: string;
  primaryCrop: string;
}

const WeatherCalendar = ({ lat, lon, locationName, primaryCrop }: WeatherCalendarProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using Open-Meteo API (free, no API key required)
      const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;
      
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&temperature_unit=celsius&timezone=auto&forecast_days=7`;

      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      const weatherCodeToDescription = (code: number) => {
        const codes: Record<number, string> = {
          0: "Clear sky",
          1: "Mainly clear",
          2: "Partly cloudy",
          3: "Overcast",
          45: "Foggy",
          48: "Foggy",
          51: "Light drizzle",
          53: "Moderate drizzle",
          55: "Dense drizzle",
          61: "Slight rain",
          63: "Moderate rain",
          65: "Heavy rain",
          71: "Slight snow",
          73: "Moderate snow",
          75: "Heavy snow",
          80: "Slight rain showers",
          81: "Moderate rain showers",
          82: "Violent rain showers",
          95: "Thunderstorm",
        };
        return codes[code] || "Unknown";
      };

      const weatherData: WeatherData = {
        current: {
          temp: currentData.current.temperature_2m,
          humidity: currentData.current.relative_humidity_2m,
          windSpeed: currentData.current.wind_speed_10m,
          description: weatherCodeToDescription(currentData.current.weather_code),
          icon: currentData.current.weather_code <= 3 ? "☀️" : currentData.current.weather_code >= 61 ? "🌧️" : "☁️"
        },
        forecast: forecastData.daily.time.map((date: string, idx: number) => ({
          date,
          tempMin: forecastData.daily.temperature_2m_min[idx],
          tempMax: forecastData.daily.temperature_2m_max[idx],
          humidity: forecastData.daily.relative_humidity_2m_mean[idx],
          precipitation: forecastData.daily.precipitation_sum[idx],
          description: weatherCodeToDescription(forecastData.daily.weather_code[idx]),
          icon: forecastData.daily.weather_code[idx] <= 3 ? "☀️" : forecastData.daily.weather_code[idx] >= 61 ? "🌧️" : "☁️"
        })),
        location: locationName
      };

      setWeather(weatherData);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Unable to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getFrostWarning = () => {
    if (!weather) return null;
    const frostDays = weather.forecast.filter(day => day.tempMin < 2);
    if (frostDays.length > 0) {
      return {
        severity: "high",
        message: `Frost warning: ${frostDays.length} day(s) with temperatures below 2°C expected. Protect sensitive plants.`
      };
    }
    return null;
  };

  const getPlantingRecommendation = () => {
    if (!weather) return null;
    
    const avgTemp = weather.forecast.slice(0, 7).reduce((sum, day) => sum + ((day.tempMax + day.tempMin) / 2), 0) / 7;
    const totalPrecip = weather.forecast.slice(0, 7).reduce((sum, day) => sum + day.precipitation, 0);
    
    const cropTempRanges: Record<string, { min: number; max: number; optimal: number }> = {
      Tomatoes: { min: 15, max: 30, optimal: 24 },
      Corn: { min: 10, max: 35, optimal: 25 },
      Rice: { min: 20, max: 35, optimal: 30 },
      Wheat: { min: 5, max: 25, optimal: 18 },
      Potatoes: { min: 10, max: 25, optimal: 18 },
      Carrots: { min: 10, max: 24, optimal: 18 },
      Lettuce: { min: 7, max: 24, optimal: 16 },
    };

    const cropRange = cropTempRanges[primaryCrop] || { min: 10, max: 30, optimal: 20 };
    
    let recommendation = "";
    let status: "good" | "caution" | "poor" = "good";

    if (avgTemp < cropRange.min) {
      recommendation = `Too cold for ${primaryCrop}. Wait for warmer weather (ideal: ${cropRange.optimal}°C).`;
      status = "poor";
    } else if (avgTemp > cropRange.max) {
      recommendation = `Too hot for optimal ${primaryCrop} growth. Consider shade or wait for cooler weather.`;
      status = "caution";
    } else if (Math.abs(avgTemp - cropRange.optimal) <= 3) {
      recommendation = `Excellent conditions for planting ${primaryCrop}! Temperature is near optimal (${cropRange.optimal}°C).`;
      status = "good";
    } else {
      recommendation = `Good conditions for ${primaryCrop}. Temperature is acceptable (optimal: ${cropRange.optimal}°C).`;
      status = "good";
    }

    if (totalPrecip > 50) {
      recommendation += " High rainfall expected - ensure good drainage.";
      if (status === "good") status = "caution";
    } else if (totalPrecip < 5) {
      recommendation += " Low rainfall - prepare irrigation systems.";
    }

    return { recommendation, status };
  };

  const getIrrigationAdvice = () => {
    if (!weather) return null;
    
    const next3Days = weather.forecast.slice(0, 3);
    const totalPrecip = next3Days.reduce((sum, day) => sum + day.precipitation, 0);
    const avgHumidity = next3Days.reduce((sum, day) => sum + day.humidity, 0) / 3;

    if (totalPrecip > 30) {
      return { message: "Heavy rain expected - reduce or skip irrigation", color: "text-blue-600" };
    } else if (totalPrecip > 10) {
      return { message: "Moderate rain expected - light irrigation may be needed", color: "text-green-600" };
    } else if (avgHumidity < 40) {
      return { message: "Low humidity - increase irrigation frequency", color: "text-orange-600" };
    } else {
      return { message: "Regular irrigation schedule recommended", color: "text-green-600" };
    }
  };

  if (loading) {
    return (
      <Card className="shadow-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 animate-pulse" />
            Loading Weather Data...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="shadow-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "Unable to load weather data"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const frostWarning = getFrostWarning();
  const plantingRec = getPlantingRecommendation();
  const irrigationAdvice = getIrrigationAdvice();

  return (
    <div className="space-y-6">
      {/* Frost Warning */}
      {frostWarning && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-destructive font-semibold">
            {frostWarning.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Weather */}
      <Card className="shadow-strong">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            Current Weather - {weather.location}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Live conditions and 7-day forecast
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Thermometer className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{weather.current.temp.toFixed(1)}°C</div>
                <div className="text-sm text-muted-foreground">{weather.current.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Droplets className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{weather.current.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Wind className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{weather.current.windSpeed.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">km/h Wind</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="text-4xl">{weather.current.icon}</div>
              <div>
                <div className="text-sm font-semibold">Conditions</div>
                <div className="text-xs text-muted-foreground">Updated now</div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              7-Day Forecast
            </h3>
            <div className="grid gap-2">
              {weather.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{day.icon}</div>
                    <div>
                      <div className="font-semibold">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-muted-foreground">{day.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold">{day.tempMax.toFixed(0)}°C / {day.tempMin.toFixed(0)}°C</div>
                      <div className="text-xs text-muted-foreground">{day.humidity}% humidity</div>
                    </div>
                    {day.precipitation > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {day.precipitation.toFixed(1)}mm
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planting Recommendations */}
      {plantingRec && (
        <Card className={`shadow-strong border-2 ${
          plantingRec.status === 'good' ? 'border-green-500' : 
          plantingRec.status === 'caution' ? 'border-yellow-500' : 
          'border-red-500'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Planting Recommendation for {primaryCrop}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-semibold ${
              plantingRec.status === 'good' ? 'text-green-600' : 
              plantingRec.status === 'caution' ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {plantingRec.recommendation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Irrigation Advice */}
      {irrigationAdvice && (
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Irrigation Schedule (Next 3 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-semibold ${irrigationAdvice.color}`}>
              {irrigationAdvice.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherCalendar;
