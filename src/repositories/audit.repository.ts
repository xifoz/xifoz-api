import { prisma } from '../lib/prisma';

export class AuditRepository {
  async log(data: {
    adminId: string;
    action: string;
    entity?: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.auditLog.create({
      data,
    });
  }
}

export const auditRepository =
  new AuditRepository();
