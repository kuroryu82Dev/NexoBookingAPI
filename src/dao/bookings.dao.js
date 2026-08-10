import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/bookings.json');

export class BookingsDao {
  constructor(filePath = dataPath) {
    this.filePath = path.resolve(filePath);
  }

  read() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    if (!Array.isArray(data)) throw new Error('El contenido de reservas debe ser un arreglo');
    return data;
  }

  write(data) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  getAll() {
    return this.read();
  }

  getById(id) {
    return this.read().find((booking) => booking.id === id) ?? null;
  }

  create(data) {
    const bookings = this.read();
    const id = bookings.length ? Math.max(...bookings.map((booking) => booking.id)) + 1 : 1;
    const booking = { id, ...data };
    bookings.push(booking);
    this.write(bookings);
    return booking;
  }

  update(id, data) {
    const bookings = this.read();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...data, id };
    this.write(bookings);
    return bookings[index];
  }
}

export default BookingsDao;
