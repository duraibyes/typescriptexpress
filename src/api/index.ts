import express from 'express';

import authRouter from './auth/auth.routes';
import categoryRouter from './category/category.routes';
import validateToken from '../middleware/validateToken';
import rolesRouter from './roles/roles.routes';

const router = express.Router();

router.use('/auth', authRouter);

router.use(validateToken);
router.use('/category', categoryRouter);
router.use('/roles', rolesRouter);

export default router;
