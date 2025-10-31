export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    condition: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    temperature: number;
    condition: string;
  }>;
}
