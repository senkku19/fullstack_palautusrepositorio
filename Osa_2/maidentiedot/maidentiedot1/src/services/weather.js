import axios from 'axios';

const apiKey = import.meta.env.VITE_SOME_KEY; 

const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city, 
        appid: apiKey, 
        units: 'metric', 
      },
    });

    const weatherData = response.data;
    console.log('Weather data:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export default {fetchWeatherData}
