import { Router } from "express";
import { checkCurrentUser, loginUser, registerUser, getAllUser, updateUser, uploadProfileImage } from "./auth.handler";
import validateToken from "../../middleware/validateToken";
import multer from 'multer';
const upload = multer(); 

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

authRouter.use(validateToken);
authRouter.post('/current-user', checkCurrentUser);
authRouter.get('/users', getAllUser);

// authRouter.use(upload.any());
authRouter.post('/user', uploadProfileImage, updateUser);

export default authRouter;