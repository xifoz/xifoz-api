import { Router } from 'express';

import { contactController } from '../../controllers/admin/contact.controller';

import { authenticate } from '../../middleware/auth/authenticate';
import { validate } from '../../middleware/validation/validate';

import {
  listContactsSchema,
  contactIdSchema,
  updateStatusSchema,
} from '../../validators/contact.validator';

const router = Router();

router.use(authenticate);

router.get(
  '/contacts',
  validate({
    query: listContactsSchema,
  }),
  contactController.list.bind(contactController),
);

router.get(
  '/contacts/:id',
  validate({
    params: contactIdSchema,
  }),
  contactController.get.bind(contactController),
);

router.patch(
  '/contacts/:id/status',
  validate({
    params: contactIdSchema,
    body: updateStatusSchema,
  }),
  contactController.updateStatus.bind(contactController),
);

router.delete(
  '/contacts/:id',
  validate({
    params: contactIdSchema,
  }),
  contactController.remove.bind(contactController),
);

export default router;
