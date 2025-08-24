
import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/apiRoutes.js';

dotenv.config();

const app = express();

//3500 como puerto para comodidad de uso de la prueba
const PORT = process.env.PORT || 3500;

//Middleware
app.use(express.json());
app.use(express.static('public'));

//Cors Basico
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Witdh, Content-Type, Accept')
    next();
});

//Rutas para la API
app.use('/api', apiRoutes)

//Ruta para servir al front
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public'});
    
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});