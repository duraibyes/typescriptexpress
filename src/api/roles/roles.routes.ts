import { Router } from 'express';
import {
    addRoles,
    getAllRoles,
    getRoleById,
    updateRoles,
    deleteRole
} from './roles.handler';
import multer from 'multer';
const upload = multer(); // Initialize multer

const rolesRouter = Router();
rolesRouter.use(upload.any());
rolesRouter.get('/', getAllRoles)
            .post('/', addRoles)
            .get('/:id', getRoleById)
            .post('/:id', updateRoles)
            .delete('/:id', deleteRole);

export default rolesRouter;