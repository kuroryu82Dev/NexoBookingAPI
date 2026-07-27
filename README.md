# Nexo Booking API

Primera entrega sencilla del proyecto Nexo Booking para el curso. La idea es mostrar una primera versión de la lógica del negocio usando clases y objetos en JavaScript.

## Qué incluye

- Proyecto con sintaxis ESM
- Variables de entorno con dotenv
- Clase para gestionar servicios de reservas y turnos
- Datos iniciales en memoria

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` con:

```env
PORT=8080
NODE_ENV=development
```

## Ejecución

```bash
npm start
```

## Endpoints de servicios

- `GET /api/services` - lista todos los servicios
- `GET /api/services/:sid` - obtiene un servicio por id
- `POST /api/services` - crea un servicio nuevo
- `PUT /api/services/:sid` - actualiza un servicio existente
- `DELETE /api/services/:sid` - elimina un servicio

Ejemplo de petición `POST /services`:

```json
{
  "name": "Masaje relajante",
  "description": "Masaje para reducir estrés",
  "duration": 45,
  "price": 3000,
  "category": "bienestar",
  "available": true
}
```

## Persistencia

Los servicios se guardan en `src/data/services.json`. El `ServiceManager` carga los datos desde ese archivo y mantiene la información cuando se crean, actualizan o eliminan servicios.

## Endpoints de reservas

- `GET /api/bookings` - lista todas las reservas
- `POST /api/bookings` - crea una reserva con su arreglo de servicios vacío
- `GET /api/bookings/:bid` - obtiene una reserva por id
- `POST /api/bookings/:bid/services/:sid` - agrega un servicio a la reserva

Las reservas se guardan en `src/data/bookings.json`. Si se agrega nuevamente el
mismo servicio, se incrementa su propiedad `quantity`.

Ejemplo de petición `POST /api/bookings`:

```json
{
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-08-10",
  "time": "18:30",
  "status": "PENDIENTE",
  "services": []
}
```

## Formato de un servicio

```json
{
  "id": 1,
  "name": "Reserva de mesa",
  "description": "Reserva para un turno en el restaurante",
  "duration": 60,
  "price": 0,
  "category": "reservas",
  "available": true
}
```

## Ejemplo de uso

```js
import BookingServiceManager from './src/managers/ServiceManager.js';

const manager = new BookingServiceManager();
console.log(manager.getServices());
```
