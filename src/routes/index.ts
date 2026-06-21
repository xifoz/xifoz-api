import { Router } from 'express';

import contactRoutes from '../routes/contact.routes';
import adminAuthRoutes from '../routes/admin/auth.routes';
import dashboardRoutes from '../routes/admin/dashboard.routes';

const apiRouter = Router();

apiRouter.use('/contact', contactRoutes);
apiRouter.use('/admin', adminAuthRoutes);
apiRouter.use('/admin/dashboard', dashboardRoutes);

export { apiRouter };
