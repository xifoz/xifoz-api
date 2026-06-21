import { AdminRole, AdminUser } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminUser | null> {
    return prisma.adminUser.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async findById(id: string): Promise<AdminUser | null> {
    return prisma.adminUser.findUnique({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    fullName: string;
    passwordHash: string;
    role: AdminRole;
  }): Promise<AdminUser> {
    return prisma.adminUser.create({
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.adminUser.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async updatePasswordHash(
    id: string,
    passwordHash: string,
  ): Promise<void> {
    await prisma.adminUser.update({
      where: { id },
      data: {
        passwordHash,
      },
    });
  }

  async setActive(
    id: string,
    active: boolean,
  ): Promise<void> {
    await prisma.adminUser.update({
      where: { id },
      data: {
        isActive: active,
      },
    });
  }

  async updateProfile(
    id: string,
    fullName: string,
  ): Promise<void> {
    await prisma.adminUser.update({
      where: { id },
      data: {
        fullName,
      },
    });
  }
}

export const adminRepository = new AdminRepository();
