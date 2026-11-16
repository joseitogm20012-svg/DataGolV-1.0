# ⚽ FútbolPredictor MVC - Proyecto 1 (Programación III)

Aplicación web desarrollada con arquitectura **MVC (Modelo - Vista - Controlador)**, base de datos NoSQL (**MongoDB**) y motor de plantillas dinámico (**EJS**) para la gestión y predicción estadística de partidos de fútbol.

---

## 📌 Cumplimiento de Requerimientos

| Requisito del Profesor | Implementación en el Proyecto |
| :--- | :--- |
| **Arquitectura MVC** | Carpetas estructuradas estrictamente en `models/`, `views/`, `controllers/`, `routes/`. |
| **Base de Datos NoSQL** | **MongoDB** con ODM **Mongoose** y validaciones de esquema. |
| **Motor de Plantillas** | **EJS** con vistas modulares (`partials/header.ejs`, `partials/navbar.ejs`, etc.). |
| **Enrutamiento HTTP** | `routes/predictionRoutes.js` con soporte para GET, POST, PUT y DELETE. |
| **CRUD Completo** | Crear pronósticos, Listar en Dashboard, Modificar/Cargar resultados y Eliminar registros. |
| **Lógica de Negocio** | Motor predictivo estadístico (`utils/predictionEngine.js`) que calcula probabilidades y marcadores. |
| **Manejo de Errores** | Páginas de error 404, 500 y alertas visuales de validación de campos. |

---

## 📁 Estructura del Proyecto

```text
PROYECTOPROGRAMACION III/
├── config/
│   └── db.js                 # Conexión a MongoDB (Mongoose)
├── controllers/
│   └── predictionController.js # Lógica de negocio, CRUD y simulación
├── models/
│   └── Prediction.js         # Esquema Mongoose con validaciones
├── routes/
│   └── predictionRoutes.js   # Definición de rutas HTTP
├── utils/
│   └── predictionEngine.js   # Algoritmo de cálculo de probabilidades
├── views/                    # Motor de plantillas EJS
│   ├── partials/             # Componentes reutilizables (navbar, header, footer, alerts)
│   ├── index.ejs             # Dashboard principal con filtros y métricas
│   ├── create.ejs            # Formulario de nuevo pronóstico con simulador en vivo
│   ├── edit.ejs              # Edición y registro de resultado final real
│   ├── details.ejs           # Vista detallada del partido y probabilidades
│   └── error.ejs             # Vista para errores 404 y 500
├── public/
│   └── css/styles.css        # Estilos deportivos y tema dark mode
├── .env                      # Variables de entorno (Puerto y URI de MongoDB)
├── seed.js                   # Script para insertar partidos de prueba
├── package.json
└── app.js                    # Servidor principal Express
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar o abrir la carpeta del proyecto
```bash
cd "PROYECTOPROGRAMACION III"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la Base de Datos (.env)
Abre el archivo `.env` y coloca tu cadena de conexión de MongoDB:
```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/futbol_predicciones?retryWrites=true&w=majority
```
*(Si tienes MongoDB instalado de forma local, puedes usar `mongodb://127.0.0.1:27017/futbol_predicciones`)*.

### 4. (Opcional) Cargar datos de prueba iniciales
```bash
npm run seed
```

### 5. Iniciar el servidor
```bash
npm run dev
# o también:
npm start
```

Abre tu navegador en: **`http://localhost:3000`**
