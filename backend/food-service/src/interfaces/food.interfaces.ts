import { Request } from "express";

export interface IFood {
    id: number;
    name: string;
    count: number;
    price: number;
    description?: string;
    img?: string;
}

export interface IFoodRequest extends Request {
    foodId: number;
}