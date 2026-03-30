import express from 'express'
import {registrationSchema, loginSchema} from '../../../shared/index.js'
import validate from '../middleware/validate.middleware.js'
import { login, logout, me, register } from '../controllers/auth.controller.js';
import authenticate from '../middleware/auth.middleware.js';
const authRouter = express.Router();

authRouter.post('/register',validate(registrationSchema),register);
authRouter.post('/login',validate(loginSchema),login);
authRouter.get('/logout',logout);
authRouter.get('/me',authenticate,me);

export default authRouter