import axios from 'axios';

// Informacion que se manda a la API de los lugares a consultar

const LOCATIONS = {
  antigua: {
    name: 'Antigua Guatemala',
    lat: 14.5575,
    lon: -90.7333,
    key: 'antigua'
  },
  chulamar: {
    name: 'Chulamar',
    lat: 13.914,
    lon: -90.895,
    key: 'chulamar'
  }
};

export const getWeatherData = async (dateString) => {
  const apiKey = process.env.OPENWEATHER_KEY;
  
  if (!apiKey) {
    throw new Error('API key no configurada');
  }

  const results = [];

  try {
    // Obtener datos del clima para las dos ubicaciones
    for (const [locationKey, location] of Object.entries(LOCATIONS)) {
      try {
        const weatherData = await fetchWeatherForLocation(location, apiKey);
        
        results.push({
          weather_date: dateString,
          location_key: locationKey,
          location_name: location.name,
          lat: location.lat,
          lon: location.lon,
          temp_c: weatherData.temp,
          feels_c: weatherData.feels_like,
          humidity_pct: weatherData.humidity,
          conditions: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          provider: 'openweathermap',
          success: true
        });

      } catch (locationError) {
        console.error(`Error obteniendo clima para ${location.name}:`, locationError.message);
        
        // Agregar registro con error para esta ubicacion
        results.push({
          weather_date: dateString,
          location_key: locationKey,
          location_name: location.name,
          lat: location.lat,
          lon: location.lon,
          temp_c: null,
          feels_c: null,
          humidity_pct: null,
          conditions: 'Error',
          description: `Error: ${locationError.message}`,
          provider: 'openweathermap',
          success: false
        });
      }
    }

    return results;

  } catch (error) {
    throw new Error(`Error general obteniendo datos del clima: ${error.message}`);
  }
};

const fetchWeatherForLocation = async (location, apiKey) => {
  try {
    // Direccion de la API
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    
    const params = {
      lat: location.lat,
      lon: location.lon,
      appid: apiKey,
      units: 'metric',
      lang: 'es'
    };

    const response = await axios.get(url, { 
      params,
      timeout: 10000 
    });

    return response.data.main && response.data.weather 
      ? {
          temp: response.data.main.temp,
          feels_like: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          weather: response.data.weather
        }
      : null;

  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
    } else if (error.request) {
      throw new Error('Sin respuesta del servidor de clima');
    } else {
      throw new Error(`Error de configuración: ${error.message}`);
    }
  }
};