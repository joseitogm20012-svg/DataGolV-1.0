# Informe Técnico - Proyecto 1: DataGol
**Materia:** Programación III  
**Estudiante:** José  
**Proyecto:** DataGol (Gestor y Predictor de Partidos de Fútbol)  
**Repositorio:** [github.com/joseitogm20012-svg/DataGolV-1.0](https://github.com/joseitogm20012-svg/DataGolV-1.0)

---

## 1. ¿De qué trata el proyecto y por qué esta idea?

Para este primer proyecto se nos pidió crear una aplicación web con arquitectura MVC, base de datos NoSQL y CRUD completo sobre una entidad. La mayoría de los ejemplos típicos suelen ser listas de tareas (To-Do), inventarios de tiendas o bibliotecas de libros. Quise salirme de lo típico y hacer algo más interactivo y útil: **DataGol**, una plataforma web que gestiona partidos de fútbol y genera pronósticos automáticos basados en datos estadísticos.

Nuestra entidad principal es el **Pronóstico de Partido**, donde se guardan los equipos, la competición, la fecha, las probabilidades estimadas de victoria/empate, los goles proyectados y el resultado final para evaluar si el pronóstico se acertó o se falló.

---

## 2. ¿Por qué elegí Node.js y Express?

* **Un solo lenguaje en todo el stack:** Al usar Node.js trabajamos con JavaScript tanto en el servidor como en la lógica del cliente y las vistas. Esto evita tener que cambiar de mentalidad o de sintaxis entre backend y frontend.
* **Manejo de peticiones asíncronas:** El motor de eventos no bloqueante de Node.js es ideal para manejar peticiones web y comunicarse con la base de datos sin congelar el servidor.
* **Express.js:** Es el framework web estándar de Node. Es minimalista, rápido y no te impone una forma obligatoria de trabajar, lo que permitió estructurar las carpetas del patrón MVC exactamente como lo exigió el profesor (`models/`, `views/`, `controllers/`, `routes/`).

---

## 3. ¿Por qué MongoDB (NoSQL) y Mongoose?

El profesor puso como requisito obligatorio utilizar una base de datos No Relacional:

* **Estructura tipo documento (BSON/JSON):** En el fútbol, un partido no es solo una fila fija; tiene atributos variados como probabilidades porcentuales, factores clave, análisis y estados que pueden ir cambiando (Pendiente -> Acertada / Fallada). MongoDB guarda todo en formato JSON nativo, que encaja de forma natural con JavaScript.
* **MongoDB Atlas (En la nube):** En vez de tener que instalar el servidor de MongoDB local en la computadora (que a veces da problemas de servicios o puertos en Windows), utilicé MongoDB Atlas. La base de datos corre en la nube, es gratuita, segura y permite que el proyecto se pueda probar desde cualquier máquina clonando el repositorio.
* **Mongoose:** Aunque MongoDB es flexible, para la materia necesitábamos asegurar la integridad de los datos. Mongoose nos permite definir un esquema estricto con validaciones:
  * Obliga a que los nombres de los equipos existan y tengan mínimo 2 caracteres.
  * Valida mediante código que el equipo local no sea idéntico al visitante.
  * Controla que los goles no puedan ser números negativos.

---

## 4. ¿Por qué EJS como motor de plantillas?

Se evaluaron opciones como Pug o Handlebars, pero elegí **EJS (Embedded JavaScript)** por razones prácticas:

* **Sintaxis idéntica a HTML:** En EJS escribes HTML estándar de toda la vida y solo incrustas lógica de servidor cuando hace falta con `<%= %>` o `<% %>`. No hay que aprender una indentación estricta ni una sintaxis rara como la de Pug.
* **Partials (Modularidad):** Permite trocear la interfaz en componentes reutilizables (`header.ejs`, `navbar.ejs`, `footer.ejs`, `alerts.ejs`). Si mañana cambio el menú de navegación, se actualiza en todas las páginas automáticamente sin repetir código.

---

## 5. Justificación de la Arquitectura MVC (Estructura de Carpetas)

Para cumplir al pie de la letra con el diseño de software solicitado, el código se separó en capas independientes:

```text
PROYECTOPROGRAMACION III/
├── config/             # Conexión a MongoDB (db.js)
├── models/             # Esquema y validaciones de Mongoose (Prediction.js)
├── controllers/        # Cerebro de la app: lógica del CRUD y cálculo (predictionController.js)
├── routes/             # Enrutamiento HTTP: GET, POST, PUT, DELETE (predictionRoutes.js)
├── utils/              # Algoritmo de predicción estadística (predictionEngine.js)
├── views/              # Vistas dinámicas en EJS y partials
└── public/             # Estilos CSS (Bootstrap 5 + tema deportivo oscuro)
```

* **`models/Prediction.js` (Modelo):** Solo se preocupa de la forma de los datos, los tipos (String, Number, Date) y las reglas de validación en la base de datos.
* **`controllers/predictionController.js` (Controlador):** Es el intermediario. Cuando el usuario pide ver el dashboard, el controlador le pide los partidos a MongoDB, calcula el porcentaje de aciertos y le manda los datos a la vista.
* **`routes/predictionRoutes.js` (Rutas):** Es el mapa de navegación. Define qué URL responde a cada método HTTP (`GET /`, `POST /predictions`, `PUT /predictions/:id`, etc.). Usamos `method-override` para poder hacer peticiones `PUT` y `DELETE` directamente desde formularios HTML.
* **`views/` (Vistas):** Solo se encargan de pintar la información en pantalla para el usuario. No tocan la base de datos directamente.

---

## 6. La lógica extra: ¿Cómo predice los partidos?

En lugar de inventar números al azar, creé un módulo en `utils/predictionEngine.js`:
1. Tiene un registro de ratings de ataque y defensa de los equipos más conocidos (Real Madrid, City, Barcelona, River, Boca, etc.) y genera métricas automáticas para equipos nuevos.
2. Aplica un factor de **ventaja de localía** (+6% de rendimiento).
3. Calcula la diferencia de poder entre ambos rivales y la traduce a porcentajes de victoria local, empate y visitante (que siempre suman 100%).
4. Estima el marcador más probable y genera un análisis redactado.
5. Además, incluye un endpoint `/api/simulate` que permite al usuario ver la predicción en vivo en el formulario mediante AJAX antes de guardarla.

---

## 7. Conclusión

El proyecto no solo cumple con los 5 puntos exigidos en la rúbrica (MVC, NoSQL, Motor de plantillas, Rutas y CRUD completo con manejo de errores), sino que resuelve un caso de uso práctico, visualmente llamativo y conectado a una base de datos real en la nube.
