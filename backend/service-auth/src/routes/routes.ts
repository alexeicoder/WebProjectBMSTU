import { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs';
import { AuthController } from '../controllers/AuthController';
import { verifyToken } from '../middleware/authMiddleware';

// ROUTER
const router = Router();

// Routes
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Auth Service');
});

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/signout', AuthController.signout);
router.get('/validatetoken', verifyToken, AuthController.validateToken);
router.post('/refresh', AuthController.refreshToken);

export default router;