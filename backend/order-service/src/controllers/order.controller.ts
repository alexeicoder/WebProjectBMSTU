/* Контроллер: работа с HTTP (валидация, преобразование данных) */
import { Request, Response } from "express";
// import { IToken, IAuthRequest } from "../interfaces/order.interfaces";
import { OrderRepository } from '../repositories/order.repository';
// import jwt from 'jsonwebtoken';
import axios, { AxiosError } from "axios";
import { IFood, IOrderItem } from "../interfaces/order.interfaces";

export class OrderController {

    // Constuctor
    constructor(private orderRepository: OrderRepository) {
    }

    // Methods

    public async findById(req: Request, res: Response): Promise<any> {

        const orderId: number = parseInt(req.params.id);

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        if (isNaN(orderId)) {
            return res.status(400).json({ message: 'Order ID must be a number' });
        }

        try {
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);

        } catch (error) {
            console.error('Ошибка при получении данных о заказе:', error);
            res.status(500).json({ message: 'Ошибка сервера.' });
        }
    }

    public async findByOwnerId(req: Request, res: Response): Promise<any> {
        const ownerId: number = parseInt(req.params.id);

        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required' });
        }

        try {

            const orders = await this.orderRepository.findByOwnerId(ownerId);

            for (const order of orders) {
                if (order.order_items as IOrderItem[]) {
                    for (const orderItem of order.order_items) {
                        try {
                            const foodItemResponse = await axios.get(`http://localhost:3200/api/food/find/id/${orderItem.id_food_item}`);
                            const foodItemData = foodItemResponse.data;
                            orderItem.name = foodItemData.name;
                            orderItem.img = foodItemData.img;
                        } catch (foodError) {
                            console.error(`Error fetching food item ${orderItem.id_food_item}:`, foodError);
                            // Handle the error appropriately, e.g., set default values or remove the item
                            orderItem.name = "Product not found";
                            orderItem.img = "";
                        }
                    }
                }
            }

            return res.status(200).json({
                count: orders.length,
                orders: orders
            });


        } catch (error) {
            console.error('Ошибка при получении данных о заказах по владельцу:', error);
            res.status(500).json({ message: 'Ошибка сервера.' });
        }

    }

    public async findByOwnerLogin(req: Request, res: Response): Promise<any> {
        const ownerLogin: string = req.params.owner_login as unknown as string;

        if (!ownerLogin) {
            return res.status(400).json({ message: 'Owner login is required' });
        }

        try {
            const user = await axios.get('http://localhost:3000/api/auth/find/user/login/' + ownerLogin);

            if (user.status === 404) {
                return res.status(404).json({ message: `This order's owner not found` });
            }

            const ownerId = user.data.id;
            const orders = await this.orderRepository.findByOwnerId(ownerId);

            return res.status(200).json({
                count: orders.length,
                orders: orders
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    return res.status(404).json({ message: `This order's owner not found: Wrong login` });
                }
                if (axiosError.response?.status === 400) {
                    return res.status(400).json({ message: `Inccorect owner login` });
                }
            }

            console.error('Ошибка при получении данных о заказах по логину владельца:', error);
            res.status(500).json({ message: 'Ошибка сервера.' });
        }
    }

    public async createOrder(req: Request, res: Response): Promise<any> {

        const ownerId: number = parseInt(req.body.ownerId);
        const foodItems: IFood[] = req.body.foodItems;

        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required' });
        }

        if (!foodItems
            || Object.keys(foodItems).length === 0
            || !Array.isArray(foodItems)) {
            return res.status(400).json({ message: 'Food items are required' });
        }

        console.log(foodItems);

        try {
            const ownerExists = await axios.get('http://localhost:3000/api/auth/exists/user/' + ownerId);

            if (ownerExists.data.exists === false) {
                return res.status(404).json({ message: 'Owner not found' });
            }

            const order = await this.orderRepository.createOrder(ownerId, foodItems);

            return res.status(200).json(order);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 400) {
                    return res.status(400).json({ message: 'Owner ID is required' });
                }
            }
        }
    }
}