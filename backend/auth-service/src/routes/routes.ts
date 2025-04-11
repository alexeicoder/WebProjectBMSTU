import { Router, Request, Response } from "express";
import { Container } from '../core/container';
import { IAuthRequest } from "../interfaces/auth.interfaces";
import { verifyToken } from '../middleware/auth.middleware';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Auth Service API');
});

router.post('/register', (req: Request, res: Response) => {
    Container.getAuthController().register(req, res)
});
router.post('/login', (req: Request, res: Response) => {
    Container.getAuthController().login(req, res);
});

router.get('/validatetoken', verifyToken, (req: IAuthRequest, res: Response) => {
    Container.getAuthController().validateToken(req, res);
})


export default router;