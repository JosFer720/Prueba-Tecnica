# Análisis de la prueba tecnica

# Decisiones

- Al ver las opciones que brinda el Banguat para recuperar los datos, la mejor opción es el del rango, ya que me permite seleccionar fecha de inicio y fecha de fin. La prueba pide que solo sea de un dia, no un rango, por lo que lo más fácil para taclear este problema es que la fecha de inicio y la de fin sean la misma, asi se pueden recuperar de un solo dia. 
- Al hacer el servicio para la API de banguat decidi que el mejor fallback sea que recupere los datos del dia de hoy.

- Pensando en el servicio del weather API, al ser pagado el servicio de obtener los datos de fechas pasadas, el sistema debe de lanzar simepre el del dia en curso, ademas de que deberia de lanzar un mensaje indicando que es el clima de hoy, con fin informativo. 
