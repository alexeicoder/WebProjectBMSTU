
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');

import pool from '../db/db';
import { generateTokens, verifyToken } from '../middleware/authMiddleware'

import { User } from '../types/user';
import { TokenPayload } from '../types/token';
import { AuthenticatedRequest } from '../types/request';

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        const { login, password }: { login: string; password: string } = req.body;

        console.log("login", login)
        console.log("password", password)
        // Валидация
        if (!login || !password) {
            res.status(400).json({
                success: false,
                message: 'Login and password are required'
            });
            return;
        }

        try {
            // Поиск пользователя
            const result = await pool.query<User>(
                'SELECT * FROM users WHERE login = $1::text',
                [login]
            );
            const user = result.rows[0];

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Пользователь не найден.'
                });
                return;
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Неверный пароль.'
                });
                return;
            }

            // Генерация токенов
            const { accessToken, refreshToken } = generateTokens(user.id);

            // Установка кук
            res.cookie('access_cookie', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60_000, // 1 минута
                sameSite: 'strict',
            });

            res.cookie('refresh_cookie', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3_600_000, // 1 час
                sameSite: 'strict',
            });

            // Успешный ответ
            res.status(200).json({
                success: true,
                message: "Успешная авторизация",
                userId: user.id
            });

        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера.'
            });
        }
    }

    static async register(req: Request, res: Response): Promise<void> {
        const { login, password, name }: { login: string; password: string; name: string } = req.body;

        if (!login || !password || !name) {
            res.status(400).json({ message: 'login, password and name are required' });
            return;
        }

        try {
            const userResult = await pool.query<User>('SELECT * FROM users WHERE login = $1', [login]);

            if (userResult.rows[0]) {
                res.status(401).json({ message: 'Пользователь уже зарегистрирован.' });
                return;
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);
            const newUserResult = await pool.query<User>(
                'INSERT INTO users (login, password, name) VALUES ($1, $2, $3) RETURNING id',
                [login, hashedPassword, name]
            );

            const newUser: User = newUserResult.rows[0];
            const { accessToken, refreshToken } = generateTokens(newUser.id);

            res.cookie('access_cookie', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 60 * 1000,
                sameSite: 'strict',
            });

            res.cookie('refresh_cookie', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000,
                sameSite: 'strict',
            });

            res.status(201).json({
                success: true,
                message: "successful register",
                userId: newUser.id
            });
        } catch (error) {
            console.error('Ошибка при регистрации пользователя', error);
            res.status(500).json({ message: 'Ошибка сервера.' });
        }
    };

    static signout(req: Request, res: Response): void {
        try {
            res.clearCookie('access_cookie', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.clearCookie('refresh_cookie', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.status(200).json({ success: true, message: 'Вы успешно вышли из системы' });
            return;
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            res.status(500).json({ message: 'Ошибка при выходе из системы' });
            return;
        }
    }

    static async validateToken(req: AuthenticatedRequest, res: Response): Promise<void> {
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            userId: req.userId
        });
    }

    static async refreshToken(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refresh_cookie;

        // Валидация наличия токена
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
            return;
        }

        try {
            // Верификация refresh token
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!
            ) as TokenPayload;

            // Генерация нового access token
            const { accessToken } = generateTokens(decoded.userId);

            // Установка нового access token в cookie
            res.cookie('access_cookie', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60_000, // 1 минута
                sameSite: 'strict',
            });

            // Успешный ответ
            res.status(200).json({
                success: true,
                message: 'Access token refreshed'
            });

        } catch (error) {
            console.error('Refresh token error:', error);

            // Очистка куков в случае ошибки
            res.clearCookie('access_cookie');
            res.clearCookie('refresh_cookie');

            res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
    }
}