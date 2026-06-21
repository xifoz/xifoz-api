import { ContactStatus } from '@prisma/client';

import { prisma } from '../lib/prisma';

export class DashboardRepository {
  async getStats() {
    const [
      totalContacts,
      newContacts,
      inProgress,
      closed,
      recentContacts,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.contactSubmission.count(),

      prisma.contactSubmission.count({
        where: {
          status: ContactStatus.NEW,
        },
      }),

      prisma.contactSubmission.count({
        where: {
          status: ContactStatus.IN_PROGRESS,
        },
      }),

      prisma.contactSubmission.count({
        where: {
          status: ContactStatus.CLOSED,
        },
      }),

      prisma.contactSubmission.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),

      prisma.auditLog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      stats: {
        totalContacts,
        newContacts,
        inProgress,
        closed,
      },
      recentContacts,
      recentAuditLogs,
    };
  }
}

export const dashboardRepository =
  new DashboardRepository();
