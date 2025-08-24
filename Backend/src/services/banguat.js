import axios from 'axios';
import xml2js from 'xml2js';

export const getExchangeRate = async (dateString) => {
    try {
        //Formatear fecha para Banguat por dia/mes/año
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // SOAP envelope para llamar a TipoCambioRangoMoneda
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <TipoCambioRangoMoneda xmlns="http://www.banguat.gob.gt/variables/ws/">
        <fechainit>${formattedDate}</fechainit>
        <fechafin>${formattedDate}</fechafin>
        <moneda>02</moneda>
        </TipoCambioRangoMoneda>
        </soap:Body>
        </soap:Envelope>`;
        
        const response = await axios.post(
            'https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx',
            soapEnvelope,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': 'http://www.banguat.gob.gt/variables/ws/TipoCambioRangoMoneda'
                },
                timeout: 15000
            }
        );
        
        // Parsear XML response del TipoCambioRangoMoneda
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);

        // Extraer datos del resultado obtenido
        const soapBody = result['soap:Envelope']['soap:Body'];
        const tipoCambioResponse = soapBody['TipoCambioRangoMonedaResponse'];
        const tipoCambioResult = tipoCambioResponse['TipoCambioRangoMonedaResult'];

        if (tipoCambioResult && tipoCambioResult.Vars && tipoCambioResult.Vars.Var) {
            const varData = Array.isArray(tipoCambioResult.Vars.Var) 
            ? tipoCambioResult.Vars.Var[0] 
            : tipoCambioResult.Vars.Var;
            return {
                date: dateString,
                provider: 'banguat',
                usd_gtq: parseFloat(varData.venta),
                compra: parseFloat(varData.compra),
                success: true
            };
        } else {
            // Si no hay datos para esa fecha intenta obtener el tipo de cambio actual
            console.warn(`No hay datos disponibles para ${formattedDate}, obteniendo tipo de cambio actual`);
            return await getCurrentExchangeRate();
        }
    
    } catch (error) {
        console.error('Error obteniendo tipo de cambio de Banguat:', error.message);
        
        // Fallback donde intenta obtener tipo de cambio actual
        try {
            return await getCurrentExchangeRate();
        } catch (fallbackError) {
            throw new Error(`Error obteniendo tipo de cambio: ${error.message}`);
        }
    }
};

const getCurrentExchangeRate = async () => {
    try {
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <TipoCambioDia xmlns="http://www.banguat.gob.gt/variables/ws/">
        </TipoCambioDia>
        </soap:Body>
        </soap:Envelope>`;
        
        const response = await axios.post(
            'https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx',
            soapEnvelope,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': 'http://www.banguat.gob.gt/variables/ws/TipoCambioDia'
                },
                timeout: 15000
            }
        );

        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);
        
        const soapBody = result['soap:Envelope']['soap:Body'];
        const tipoCambioResponse = soapBody['TipoCambioDiaResponse'];
        const tipoCambioResult = tipoCambioResponse['TipoCambioDiaResult'];
        
        if (tipoCambioResult && tipoCambioResult.CambioDolar) {
            const cambio = tipoCambioResult.CambioDolar;
            return {
                date: new Date().toISOString().split('T')[0],
                provider: 'banguat',
                usd_gtq: parseFloat(cambio.VentaDolar),
                compra: parseFloat(cambio.CompraDolar),
                success: true
            };
        }
        
        throw new Error('No se pudo obtener el tipo de cambio actual');
        
    } catch (error) {
        throw new Error(`Error obteniendo tipo de cambio actual: ${error.message}`);
    }
};