# Nexo Booking API

API REST para gestionar servicios y reservas, persistida en archivos JSON y organizada con arquitectura en capas.

## Requisitos y ejecución

- Node.js 20 o superior
- npm

```bash
npm install
copy .env.example .env
npm start
```

Durante el desarrollo puede usarse `npm run dev`. Las pruebas se ejecutan con `npm test`.

## Arquitectura

Cada petición recorre el siguiente flujo:

```text
Router → Controller → Service → Repository → DAO → archivo JSON
```

- `routes`: define las URLs y conecta cada endpoint con un controller.
- `controllers`: interpreta `req`, delega el caso de uso y construye `res`.
- `services`: contiene validaciones y reglas de negocio, sin conocer HTTP ni archivos.
- `repositories`: ofrece una interfaz de acceso a datos y desacopla el negocio de la persistencia.
- `dao`: lee y escribe directamente los archivos de `src/data`, sin reglas de negocio.
- `config/layer.instances.js`: compone las dependencias de las capas.

Esta separación permite reemplazar los DAO de JSON por implementaciones de MongoDB/Mongoose sin modificar controllers ni reglas de negocio. La regla que incrementa `quantity` cuando un servicio ya existe en una reserva está implementada exclusivamente en `bookings.service.js`.

## Endpoints

| Método | URL | Descripción |
| --- | --- | --- |
| GET | `/api/services` | Lista servicios; acepta `category` y `available` |
| GET | `/api/services/:sid` | Obtiene un servicio |
| POST | `/api/services` | Crea un servicio |
| PUT | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio |
| GET | `/api/bookings` | Lista reservas (compatibilidad con la API existente) |
| POST | `/api/bookings` | Crea una reserva |
| GET | `/api/bookings/:bid` | Obtiene una reserva |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

Las respuestas conservan el formato `{ status: 'success', data }` o `{ status: 'error', message }`. En `requests.http` hay ejemplos para probar la API.

## Variables de entorno

Copiar `.env.example` como `.env`. Nunca debe versionarse `.env`, credenciales reales ni `node_modules`.
