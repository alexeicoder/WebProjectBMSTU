import { Router, Request, Response } from "express";
import { authController } from '../core/container';
// import { verifyToken } from '../middleware/auth.middleware';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Auth Service API');
});

router.post('/register', authController.register);
router.post('/login', authController.login);


export default router;