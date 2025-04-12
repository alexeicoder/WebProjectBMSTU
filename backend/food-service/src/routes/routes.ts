import { Router, Request, Response } from "express";
import { Container } from "../core/container";
// import { IFoodRequest } from "../interfaces/food.interfaces";

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Food Service API');
});

router.get('/all', (req: Request, res: Response) => {
    Container.getFoodController().getAllFoods(req, res);
})

router.get('/find/id/:id', (req: Request, res: Response) => {
    Container.getFoodController().findById(req, res);
})

router.get('/find/name/:name', (req: Request, res: Response) => {
    Container.getFoodController().findByName(req, res);
})

// router.get('/data/:id', (req: Request, res: Response) => {
//     Container.getFoodController().findById(req, res);
// })

// router.get('/validatetoken', verifyToken, (req: IAuthRequest, res: Response) => {
//     Container.getAuthController().validateToken(req, res);
// })

export default router;