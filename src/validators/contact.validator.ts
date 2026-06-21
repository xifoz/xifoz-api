import { z } from 'zod';
import { ContactStatus } from '@prisma/client';

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
