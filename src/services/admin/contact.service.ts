import { ContactStatus } from '@prisma/client';

import {
  contactRepository,
  ContactQuery,
} from '../../repositories/contact.repository';

import { NotFoundError } from '../../core/errors/app-error';

export class ContactService {
  async list(query: ContactQuery) {
    return contactRepository.findAll(query);
  }

  async get(id: string) {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    return contact;
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
  ) {
    await this.get(id);

    return contactRepository.updateStatus(id, status);
  }

  async remove(id: string) {
    await this.get(id);

    await contactRepository.delete(id);

    return {
      success: true,
    };
  }
}

export const contactService =
  new ContactService();
