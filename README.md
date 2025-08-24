# Análisis de la prueba tecnica

# Decisiones

- Al ver las opciones que brinda el Banguat para recuperar los datos, la mejor opción es el del rango, ya que me permite seleccionar fecha de inicio y fecha de fin. La prueba pide que solo sea de un dia, no un rango, por lo que lo más fácil para taclear este problema es que la fecha de inicio y la de fin sean la misma, asi se pueden recuperar de un solo dia. 

- Al hacer el servicio para la API de banguat decidi que el mejor fallback sea que recupere los datos del dia de hoy.

- Pensando en el servicio del weather API, al ser pagado el servicio de obtener los datos de fechas pasadas, el sistema debe de lanzar simepre el del dia en curso. 

- En la base de datos se debe de guardar la fecha que se consulto en la base de datos, como con la API del clima no se puede obtener la informacion de la fecha que se consulta entonces existe discrepancia, ya que se guardara como la fecha que se busco pero con informacion del dia.

- Debe de existir validacion doble respecto al cambio de fecha, esto tanto en el front como en el back, se me hace mas facil hacerlo directo en el front porque se puede restringir las opciones seleccionables en un calendario.

- las fechas se deben de normalizar al ser pasadas, y tomarse en cuenta desde media noche.

Perfecto, entendido. Lo dejo exactamente en ese estilo, con listas simples y comandos cortos, sin adornos. Aquí tienes la continuación de tu README:

---

# Instalación

* Clonar el repositorio
  `git clone https://github.com/JosFer720/Prueba-Tecnica.git`

* Ir a la carpeta `Proyecto`
  `cd Prueba-Tecnica/Proyecto`

* Copiar `.env.example` a `.env` y poner la key de openweather
  `cp .env.example .env`
  esto en el espacio marcado como: **OPENWEATHER_KEY= #Aqui va la api key del open weather**

* Correr con `docker-compose up --build`

* La app queda en `http://localhost:3500`

Si no se usa docker:

* `npm install`
* `npm run dev`

# Endpoints

* `POST /api/consultar` -> consulta tipo de cambio con la API del banguat, usando su API SOAP.  
  Se utiliza el metodo de rango de fechas porque es el unico que permite recuperar conversiones pasadas.  
  Para un dia en especifico se manda la misma fecha como inicio y fin del rango.  
  Tambien consulta el clima en Chulamar y Antigua Guatemala, enviando las coordenadas de cada lugar y recibiendo la informacion actual de temperatura, sensacion termica, humedad y condiciones.  
  Todo lo recuperado se guarda en la base de datos.  

* `GET /api/datos/:fecha` -> devuelve la informacion ya guardada en la base de datos para la fecha indicada. Incluye tipo de cambio y clima si estan disponibles.  

* `GET /api/health` -> endpoint de verificacion que revisa el estado de la API y de la conexion con la base de datos, util para saber si el servicio esta funcionando correctamente.  


# Base de datos

* MySQL 8
* `fx_rate_gt`: tipo de cambio del banguat
* `weather_gt`: clima por ubicación
