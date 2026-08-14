# Nexo Booking API

API REST para gestionar servicios y reservas con MongoDB Atlas, Mongoose y una arquitectura en capas.

## Requisitos y ejecución

- Node.js 20 o superior
- MongoDB Atlas (o una instancia compatible de MongoDB)
- npm

```bash
npm install
copy .env.example .env
npm start
```

Configura `MONGO_URI` en tu `.env` antes de iniciar. Para desarrollo puede usarse `npm run dev` y para ejecutar las pruebas, `npm test`.

## Variables de entorno

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

El archivo `.env` y `node_modules` están ignorados por Git. Nunca deben subirse credenciales reales al repositorio.

## Arquitectura

Cada petición recorre este flujo:

```text
Router → Controller → Service → Repository → DAO → Mongoose → MongoDB
```

- `routes`: define las URLs.
- `controllers`: interpreta HTTP y construye la respuesta.
- `services`: contiene validaciones y reglas de negocio.
- `repositories`: desacopla la lógica de negocio de la persistencia.
- `dao`: consulta los modelos Mongoose.
- `models`: define las colecciones `services`, `bookings` y `messages`.
- `config/database.js`: administra la conexión con MongoDB.

En una reserva, cada servicio se almacena como `{ service: ObjectId, quantity: Number }`; no se duplica el objeto completo. Si se agrega el mismo servicio nuevamente, se incrementa su cantidad.

## Endpoints

| Método | URL                                | Descripción                                      |
| ------ | ---------------------------------- | ------------------------------------------------ |
| GET    | `/api/services`                    | Lista servicios; acepta `category` y `available` |
| GET    | `/api/services/:sid`               | Obtiene un servicio                              |
| POST   | `/api/services`                    | Crea un servicio                                 |
| PUT    | `/api/services/:sid`               | Actualiza un servicio                            |
| DELETE | `/api/services/:sid`               | Elimina un servicio                              |
| GET    | `/api/bookings`                    | Lista reservas                                   |
| POST   | `/api/bookings`                    | Crea una reserva                                 |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva                              |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva                 |

## Vistas y tiempo real

- `GET /views/services`: catálogo renderizado con Handlebars desde MongoDB.
- `GET /views/availability`: reservas y servicios disponibles desde MongoDB.

Express y Socket.io comparten el mismo servidor HTTP. Los cambios exitosos en
servicios emiten `services:changed`; crear una reserva o agregarle un servicio
emite `bookings:changed`. El navegador consulta la API REST y actualiza solamente
el contenido afectado, sin recargar la página.

Los parámetros `:sid` y `:bid` son IDs de MongoDB. Las respuestas mantienen el formato `{ status: 'success', data }` o `{ status: 'error', message }`.

### Consultas avanzadas de servicios

`GET /api/services` admite `category`, `available`, `page`, `limit`, `sortBy` y
`order`. `available` acepta `true` o `false`; `order`, `asc` o `desc`; y
`sortBy` permite `name`, `category`, `duration`, `price`, `available`,
`createdAt` y `updatedAt`. El límite máximo es 100.

```http
GET /api/services?category=salud&available=true&page=2&limit=5&sortBy=price&order=desc
```

La propiedad `data` continúa siendo el arreglo de servicios y `pagination`
incluye `total`, `page`, `limit`, `totalPages`, `hasPrevPage` y `hasNextPage`.

### Validaciones y relaciones

Zod valida, antes de consultar MongoDB, la creación y actualización de
servicios, la creación de reservas, los filtros de servicios y los ObjectId al
agregar un servicio a una reserva. Los errores responden con estado HTTP 400 y
un mensaje que identifica los campos inválidos.

Las reservas almacenan cada relación como `{ service: ObjectId, quantity }`.
Para obtener los datos completos de los servicios relacionados se utiliza:

```http
GET /api/bookings/64b000000000000000000001
```

Este endpoint aplica `populate('services.service')`; por eso cada elemento de
`services` contiene el documento del servicio y su cantidad, sin duplicarlo en
la colección de reservas.
