import { ContactStatus, Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

export interface ContactQuery {
  page: number;
  limit: number;
  search?: string;
  status?: ContactStatus;
}

export class ContactRepository {
  async findAll(query: ContactQuery) {
    const where: Prisma.ContactSubmissionWhereInput = {};

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          phone: true,
          service: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.contactSubmission.count({
        where,
      }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findById(id: string) {
    return prisma.contactSubmission.findUnique({
      where: { id },
    });
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
  ) {
    return prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    return prisma.contactSubmission.delete({
      where: { id },
    });
  }
}

export const contactRepository =
  new ContactRepository();
