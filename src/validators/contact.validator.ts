import { z } from 'zod';
import { ContactStatus } from '@prisma/client';

/*
|--------------------------------------------------------------------------
| Public Website Contact Form
|--------------------------------------------------------------------------
*/

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().email(),

  phone: z.string().trim().optional(),

  company: z.string().trim().optional(),

  service: z.string().trim().optional(),

  subject: z.string().trim().optional(),

  message: z.string().trim().min(10).max(5000),

  ipAddress: z.string().optional(),

  userAgent: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/*
|--------------------------------------------------------------------------
| Admin Contact APIs
|--------------------------------------------------------------------------
*/

export const listContactsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().optional(),

  status: z.nativeEnum(ContactStatus).optional(),
});

export const contactIdSchema = z.object({
  id: z.string().cuid(),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ContactStatus),
});

export type ListContactsInput =
  z.infer<typeof listContactsSchema>;

export type UpdateStatusInput =
  z.infer<typeof updateStatusSchema>;
