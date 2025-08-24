import { validateDate, formatDateForDB } from '../utils/dateValidator.js';
import { getExchangeRate } from '../services/banguatService.jsvice.js';
import { getWeatherData } from '../services/weatherService.js';
import { saveExchangeRate, saveWeatherData, getDataByDate } from '../models/dataModel.js';

export const consultarDatos = async (req, res) => {
  try {
    const { fecha } = req.body;

    // Validar fecha
    validateDate(fecha);

    const dateForDB = formatDateForDB(fecha);
    
    console.log(`Consultando datos para la fecha: ${dateForDB}`);

    // Variables para almacenar resultados
    let exchangeRateResult = null;
    let weatherDataResult = [];
    let errors = [];

    // Obtener tipo de cambio del banguat
    try {
      console.log('💱 Obteniendo tipo de cambio...');
      exchangeRateResult = await getExchangeRate(dateForDB);
      
      if (exchangeRateResult.success) {
        // Guardar en base de datos
        const saveResult = await saveExchangeRate({
          date: dateForDB,
          provider: exchangeRateResult.provider,
          usd_gtq: exchangeRateResult.usd_gtq,
          compra: exchangeRateResult.compra
        });
        
        console.log('Tipo de cambio guardado:', saveResult);
      }
    } catch (error) {
      console.error('Error con el guardado tipo de cambio:', error.message);
      errors.push(`Tipo de cambio: ${error.message}`);
    }

    // Obtener datos del clima
    try {
      console.log('Obteniendo datos del clima...');
      weatherDataResult = await getWeatherData(dateForDB);
      
      if (weatherDataResult.length > 0) {
        // Guardar en base de datos
        const saveResults = await saveWeatherData(weatherDataResult);
        console.log('Datos del clima guardados:', saveResults);
      }
    } catch (error) {
      console.error('Error al guardar los datos del clima:', error.message);
      errors.push(`Clima: ${error.message}`);
    }

    // Preparar respuesta
    const response = {
      success: true,
      fecha: dateForDB,
      datos: {
        tipo_cambio: exchangeRateResult,
        clima: weatherDataResult
      }
    };

    // Si hay errores pero algunos datos fueron obtenidos
    if (errors.length > 0) {
      response.warnings = errors;
      
      // Si no se obtuvo ningun dato entonces es un error completo
      if (!exchangeRateResult && weatherDataResult.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'No se pudieron obtener datos de ninguna fuente',
          errors
        });
      }
    }

    res.json(response);

  } catch (error) {
    console.error('Error general:', error.message);
    
    if (error.message.includes('fecha')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


// Consulta a la base para banguat y el clima, esto por fecha

export const obtenerDatosGuardados = async (req, res) => {
  try {
    const { fecha } = req.params;
    
    validateDate(fecha);
    const dateForDB = formatDateForDB(fecha);
    
    const data = await getDataByDate(dateForDB);
    
    res.json({
      success: true,
      fecha: dateForDB,
      datos: data
    });

  } catch (error) {
    console.error('Error obteniendo datos guardados:', error.message);
    
    if (error.message.includes('fecha')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error consultando datos guardados',
      error: error.message
    });
  }
};