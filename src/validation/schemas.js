import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Debe ser un ObjectId válido');
const text = (field) => z.string().trim().min(1, `${field} es obligatorio`);

export const createServiceSchema = z
  .object({
    name: text('name'),
    description: text('description'),
    duration: z.number().int().positive('duration debe ser un entero mayor a 0'),
    price: z.number().nonnegative('price debe ser mayor o igual a 0'),
    category: text('category'),
    available: z.boolean({ message: 'available debe ser booleano' })
  })
  .strict();

export const updateServiceSchema = createServiceSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debe enviar al menos un campo');

export const createBookingSchema = z
  .object({
    clientName: text('clientName'),
    clientEmail: z.string().trim().email('clientEmail no es válido'),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD')
      .refine((date) => !Number.isNaN(Date.parse(`${date}T00:00:00Z`)), 'date no es válida'),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time debe tener formato HH:mm'),
    status: text('status'),
    services: z.array(z.never()).max(0, 'La reserva debe iniciar sin servicios').optional()
  })
  .strict();

export const addServiceToBookingSchema = z.object({ bid: objectId, sid: objectId });

export const bookingIdSchema = z.object({ bid: objectId });

export const updateBookingServiceSchema = z
  .object({ quantity: z.number().int().positive('quantity debe ser un entero mayor a 0') })
  .strict();

export const servicesQuerySchema = z
  .object({
    category: z.string().trim().min(1, 'category no puede estar vacío').optional(),
    available: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z
      .enum(['name', 'category', 'duration', 'price', 'available', 'createdAt', 'updatedAt'])
      .default('createdAt'),
    order: z.enum(['asc', 'desc']).default('asc')
  })
  .strict();
