export const validateDate = (dateString) => {
    // La fecha no debe de estar vacia 
    if (!dateString){
        throw new Error('Fecha vacia, este campo es requerido')
    }

    const inputDate = new Date(dateString);
    const today = new Date();

    // Verificar si la fecha es valida
    if (isNaN(inputDate.getTime())){
        throw new Error("Fecha no valida");
    }

    // Normalizar para comparar solo las fechas
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const inputNormalized = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    // Calcular fecha limite de 5 dias atras
    const fiveDaysAgo = new Date(todayNormalized);
    fiveDaysAgo.setDate(todayNormalized.getDate() - 5);

    // Verificar que no sea fecha futura
    if (inputNormalized > todayNormalized) {
        throw new Error('No se permiten fechas futuras');
    }

    // Verificar que no sea mas antigua que 5 dias
    if (inputNormalized < fiveDaysAgo) {
        throw new Error('La fecha no puede ser mayor a 5 dias en el pasado');
    }

    return true;
};

export const formatDateForBanguat = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

export const formatDateForDB = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};