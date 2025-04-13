import { Router, Request, Response } from "express";
import { Container } from '../core/container';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Order Service API');
});

router.get('/find/id/:id', (_req: Request, res: Response) => {
    Container.getOrderController().findById(_req, res);
});

router.get('/find/owner/id/:id', (_req: Request, res: Response) => {
    Container.getOrderController().findByOwnerId(_req, res);
});

router.get('/find/owner/login/:owner_login', (_req: Request, res: Response) => {
    Container.getOrderController().findByOwnerLogin(_req, res);
});


export default router;