export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    condition: string;
  };
  hourlyToday: Array<{
    time: string;
    hour: number;
    temperature: number;
    condition: string;
    precipitation: number;
    windSpeed: number;
  }>;
  forecast: Array<{
    date: string;
    day: string;
    temperature: number;
    condition: string;
  }>;
}
