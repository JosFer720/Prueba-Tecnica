const API_BASE_URL = '/api';

function clearMessages() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getLocationName(key) {
    const names = {
        'antigua': 'Antigua Guatemala',
        'chulamar': 'Chulamar (Puerto San José)'
    };
    return names[key] || key;
}

document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fecha');
    const consultarBtn = document.getElementById('consultarBtn');
    const messageArea = document.getElementById('messageArea');
    const resultados = document.getElementById('resultados');
    
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    
    fechaInput.max = formatDate(today);
    fechaInput.min = formatDate(fiveDaysAgo);
    fechaInput.value = formatDate(today);
    
    fechaInput.addEventListener('change', function() {
        if (!validateDate(fechaInput.value)) {
            consultarBtn.disabled = true;
        } else {
            consultarBtn.disabled = false;
            clearMessages();
        }
    });
    
    document.getElementById('consultaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const fecha = fechaInput.value;
        
        if (!validateDate(fecha)) {
            return;
        }
        
        consultarBtn.disabled = true;
        consultarBtn.textContent = 'Consultando...';
        clearMessages();
        resultados.style.display = 'none';
        
        try {
            const response = await fetch(`${API_BASE_URL}/consultar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fecha })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Datos obtenidos exitosamente', 'success');
                mostrarResultados(data.datos, fecha);
            } else {
                showMessage('Error: ' + data.message, 'error');
            }
            
        } catch (error) {
            showMessage('Error de conexión', 'error');
        }
        
        consultarBtn.disabled = false;
        consultarBtn.textContent = 'Consultar';
    });
});


function validateDate(dateString) {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 4);

    today.setHours(23, 59, 59, 999);
    fiveDaysAgo.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < fiveDaysAgo || selectedDate > today) {
        showMessage('La fecha debe estar entre hoy y los últimos 5 días', 'error');
        return false;
    }

    return true;
}

function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.textContent = message;
    messageArea.appendChild(div);
}

function mostrarResultados(datos, fecha) {
    const fechaResultado = document.getElementById('fechaResultado');
    const ventaRate = document.getElementById('ventaRate');
    const compraRate = document.getElementById('compraRate');
    const exchangeTime = document.getElementById('exchangeTime');
    const weatherGrid = document.getElementById('weatherGrid');
    const resultados = document.getElementById('resultados');
    
    fechaResultado.textContent = new Date(fecha).toLocaleDateString('es-GT');
    
    if (datos.tipo_cambio && datos.tipo_cambio.success !== false) {
        ventaRate.textContent = `Q ${parseFloat(datos.tipo_cambio.usd_gtq).toFixed(5)}`;
        compraRate.textContent = `Q ${parseFloat(datos.tipo_cambio.compra || 0).toFixed(5)}`;
        exchangeTime.textContent = datos.tipo_cambio.fetched_at 
            ? `Actualizado: ${new Date(datos.tipo_cambio.fetched_at).toLocaleString('es-GT')}` 
            : '';
    } else {
        ventaRate.textContent = 'No disponible';
        compraRate.textContent = 'No disponible';
        exchangeTime.textContent = 'Error obteniendo datos';
    }
    
    weatherGrid.innerHTML = '';
    if (datos.clima && datos.clima.length > 0) {
        datos.clima.forEach(weather => {
            const card = document.createElement('div');
            card.className = 'card weather-card';
            
            const temp = weather.temp_c !== null && weather.temp_c !== undefined 
                ? `${weather.temp_c.toFixed(1)}°C` : 'N/A';
            const feelsLike = weather.feels_c !== null && weather.feels_c !== undefined 
                ? `${weather.feels_c.toFixed(1)}°C` : 'N/A';
            const humidity = weather.humidity_pct !== null && weather.humidity_pct !== undefined 
                ? `${weather.humidity_pct}%` : 'N/A';
            
            card.innerHTML = `
                <h4>${getLocationName(weather.location_key)}</h4>
                <p>Temperatura: ${temp}</p>
                <p>Sensación: ${feelsLike}</p>
                <p>Humedad: ${humidity}</p>
                <p>Condición: ${weather.description || weather.condition || 'Sin descripción'}</p>
            `;
            weatherGrid.appendChild(card);
        });
    } else {
        weatherGrid.innerHTML = '<div class="card">No se pudieron obtener datos del clima</div>';
    }
    
    resultados.style.display = 'block';
}