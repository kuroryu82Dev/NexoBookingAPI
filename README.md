# Nexo Booking API

API REST de turnos y reservas organizada en routers, controllers y managers. Los routers definen las URLs, los controllers procesan las solicitudes y respuestas, y los managers concentran la lógica y la persistencia en archivos JSON.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm start
```

Crear previamente un archivo `.env` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

## Endpoints de servicios

| Método | URL | Descripción |
| --- | --- | --- |
| GET | `/api/services` | Lista los servicios |
| GET | `/api/services/:sid` | Obtiene un servicio por ID |
| POST | `/api/services` | Crea un servicio |
| PUT | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio |

El listado admite los filtros opcionales `category` y `available`.

## Endpoints de reservas

| Método | URL | Descripción |
| --- | --- | --- |
| GET | `/api/bookings` | Lista las reservas |
| POST | `/api/bookings` | Crea una reserva |
| GET | `/api/bookings/:bid` | Obtiene una reserva por ID |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

Una reserva nueva inicia con `services` vacío. Si se agrega dos veces el mismo servicio, se incrementa su cantidad.

## Persistencia y arquitectura

- `src/routes`: declara endpoints y los conecta con controllers.
- `src/controllers`: lee `params`, `query` y `body`, delega al manager y genera respuestas HTTP.
- `src/managers`: valida y administra los datos sin depender de `req` ni `res`.
- `src/data`: almacena servicios y reservas en archivos JSON.

Todas las respuestas usan `status` con los valores `success` o `error`, más `data` o `message` según corresponda. En [requests.http](./requests.http) hay ejemplos listos para probar las rutas.
