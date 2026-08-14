# Nexo Booking API

Backend para administrar servicios, reservas y disponibilidad. Incluye consultas avanzadas, validación previa a la base de datos, relaciones entre colecciones y vistas actualizadas mediante WebSockets.

## Tecnologías utilizadas

- Node.js 20+
- Express 5
- MongoDB y Mongoose
- Zod
- Handlebars
- Socket.IO
- Node Test Runner

La API utiliza una arquitectura `Router → Controller → Service → Repository → DAO → Mongoose`. Las reglas de negocio y validaciones no se mezclan con rutas ni modelos.

## Instalación

```bash
git clone https://github.com/kuroryu82Dev/NexoBookingAPI.git
cd NexoBookingAPI
npm install
```

Copia `.env.example` como `.env` y reemplaza la URI de ejemplo. `.env` y `node_modules` están excluidos mediante `.gitignore`.

## Variables de entorno

```env
PORT=8080
APP_NAME=Nexo Booking API
APP_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

| Variable    | Descripción                     |
| ----------- | ------------------------------- |
| `PORT`      | Puerto HTTP de la aplicación.   |
| `APP_NAME`  | Nombre descriptivo del sistema. |
| `APP_ENV`   | Entorno de ejecución.           |
| `MONGO_URI` | Cadena de conexión a MongoDB.   |

## Ejecución

```bash
npm start
npm run dev
npm test
npm run format:check
```

La API queda disponible en `http://localhost:8080` o en el puerto configurado.

## Endpoints principales

### Servicios

| Método   | Endpoint             | Acción                              |
| -------- | -------------------- | ----------------------------------- |
| `GET`    | `/api/services`      | Listar, filtrar, ordenar y paginar. |
| `GET`    | `/api/services/:sid` | Consultar un servicio.              |
| `POST`   | `/api/services`      | Crear un servicio.                  |
| `PUT`    | `/api/services/:sid` | Actualizar un servicio.             |
| `DELETE` | `/api/services/:sid` | Eliminar un servicio.               |

Acepta `category`, `available`, `page`, `limit`, `sortBy` y `order`:

```http
GET /api/services?category=salud&available=true&page=2&limit=5&sortBy=price&order=desc
```

La respuesta incluye `total`, `page`, `limit`, `totalPages`, `hasPrevPage` y `hasNextPage` dentro de `pagination`.

### Reservas

| Método   | Endpoint                           | Acción                                         |
| -------- | ---------------------------------- | ---------------------------------------------- |
| `GET`    | `/api/bookings`                    | Listar reservas.                               |
| `POST`   | `/api/bookings`                    | Crear una reserva.                             |
| `GET`    | `/api/bookings/:bid`               | Consultar con servicios completos.             |
| `POST`   | `/api/bookings/:bid/services/:sid` | Agregar un servicio o incrementar su cantidad. |
| `PUT`    | `/api/bookings/:bid/services/:sid` | Establecer cantidad con `{ "quantity": 2 }`.   |
| `DELETE` | `/api/bookings/:bid/services/:sid` | Quitar un servicio.                            |
| `DELETE` | `/api/bookings/:bid/services`      | Vaciar los servicios.                          |
| `DELETE` | `/api/bookings/:bid`               | Eliminar la reserva.                           |

Cada relación se almacena como `{ service: ObjectId, quantity: Number }`. `GET /api/bookings/:bid` ejecuta `populate('services.service')`, sin duplicar el servicio en la reserva.

## Validaciones y errores

Zod valida antes de acceder a MongoDB la creación y actualización de servicios, creación de reservas, filtros, identificadores y cantidades. Los datos inválidos responden `400`; los recursos inexistentes, `404`, con `{ "status": "error", "message": "..." }`.

## Vistas y WebSockets

- `/services`: catálogo de servicios.
- `/realtime-services`: catálogo conectado a Socket.IO.
- `/availability`: reservas y servicios disponibles.

Los cambios en servicios emiten `services:changed`; los cambios en reservas, `bookings:changed`. Las vistas se sincronizan sin recargar. Las URLs anteriores bajo `/views` siguen disponibles.

## Pruebas manuales

`requests.http` contiene solicitudes listas para VS Code REST Client o herramientas compatibles. Incluye CRUD de servicios, ciclo de reservas, `populate` y un caso inválido.

## Notas adicionales

- No se incluyen credenciales, `.env`, `node_modules` ni archivos temporales.
- Los datos en `src/data` pertenecen a módulos heredados basados en archivos; `/api/services` y `/api/bookings` usan MongoDB.
- La arquitectura por capas permite ampliar el sistema e integrarlo con el POS de Nexo.
