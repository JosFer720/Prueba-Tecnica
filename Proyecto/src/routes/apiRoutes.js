import express from 'express';
import { consultarDatos, obtenerDatosGuardados } from '../controllers/dataController.js';
import { testConnection } from '../config/database.js';

const router = express.Router();

// Ruta para consultar datos que se obtiene de las APIs y guarda las guarda en la database
router.post('/consultar', consultarDatos);

// Ruta para obtener datos ya guardados en la database
router.get('/datos/:fecha', obtenerDatosGuardados);

// Ruta de health check
router.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.json({
      success: true,
      status: 'API funcionando correctamente',
      database: dbConnected ? 'Conectada' : 'Desconectada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'Error en el servidor',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;