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

## Formato de un servicio

```js
{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
```

## Ejemplo de uso

```js
import BookingServiceManager from './src/managers/ServiceManager.js';

const manager = new BookingServiceManager();
console.log(manager.getServices());
```
