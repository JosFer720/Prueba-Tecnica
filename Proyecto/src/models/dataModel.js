import { pool } from '../config/database.js';

// Guardar en la tabla del Banguat los datos que se obtienen con la API

export const saveExchangeRate = async (exchangeData) => {
  try {
    const { date, provider, usd_gtq, compra } = exchangeData;
    
    const query = `
      INSERT INTO fx_rate_gt (rate_date, provider, usd_gtq, compra)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        usd_gtq = VALUES(usd_gtq),
        compra = VALUES(compra),
        fetched_at = CURRENT_TIMESTAMP
    `;
    
    const [result] = await pool.execute(query, [date, provider, usd_gtq, compra]);
    
    return {
      success: true,
      inserted: result.affectedRows === 1,
      updated: result.affectedRows === 2
    };

  } catch (error) {
    console.error('Error guardando tipo de cambio:', error);
    throw new Error(`Error guardando tipo de cambio: ${error.message}`);
  }
};


// Guardar en la tabla del weatherAPi los datos que se obtienen

export const saveWeatherData = async (weatherDataArray) => {
  const results = [];
  
  for (const weatherData of weatherDataArray) {
    try {
      const {
        weather_date,
        location_key,
        lat,
        lon,
        temp_c,
        feels_c,
        humidity_pct,
        conditions,
        description,
        provider
      } = weatherData;

      const query = `
        INSERT INTO weather_gt (
          weather_date, location_key, lat, lon, temp_c, feels_c, 
          humidity_pct, conditions, description, provider
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          lat = VALUES(lat),
          lon = VALUES(lon),
          temp_c = VALUES(temp_c),
          feels_c = VALUES(feels_c),
          humidity_pct = VALUES(humidity_pct),
          conditions = VALUES(conditions),
          description = VALUES(description),
          fetched_at = CURRENT_TIMESTAMP
      `;

      const [result] = await pool.execute(query, [
        weather_date,
        location_key,
        lat,
        lon,
        temp_c,
        feels_c,
        humidity_pct,
        conditions,
        description,
        provider
      ]);

      results.push({
        location_key,
        success: true,
        inserted: result.affectedRows === 1,
        updated: result.affectedRows === 2
      });

    } catch (error) {
      console.error(`Error guardando datos del clima para ${weatherData.location_key}:`, error);
      results.push({
        location_key: weatherData.location_key,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

// Obtnener de la base los datos por fecha
export const getDataByDate = async (date) => {
  try {
    // Obtener tipo de cambio
    const exchangeQuery = `
      SELECT rate_date, provider, usd_gtq, compra, fetched_at
      FROM fx_rate_gt
      WHERE rate_date = ?
    `;
    
    const [exchangeRows] = await pool.execute(exchangeQuery, [date]);

    // Obtener datos del clima
    const weatherQuery = `
      SELECT weather_date, location_key, lat, lon, temp_c, feels_c,
             humidity_pct, conditions, description, provider, fetched_at
      FROM weather_gt
      WHERE weather_date = ?
      ORDER BY location_key
    `;
    
    const [weatherRows] = await pool.execute(weatherQuery, [date]);

    return {
      exchange_rate: exchangeRows[0] || null,
      weather_data: weatherRows
    };

  } catch (error) {
    console.error('Error obteniendo datos por fecha:', error);
    throw new Error(`Error consultando datos: ${error.message}`);
  }
};