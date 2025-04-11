/* Контроллер: работа с HTTP (валидация, преобразование данных) */
import { Request, Response } from "express";
import { IToken, IAuthRequest } from "../interfaces/order.interfaces";
import { UserRepository } from '../repositories/order.repository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthController {

    // Constuctor
    constructor(private userRepository: UserRepository) {
        // console.log("AuthController created, userRepository:", userRepository);
    }

    // Methods
    private generateTokens(userId: number): IToken {
        return {
            accessToken: jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1m' }),
            refreshToken: jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '1h' })
        };
    }

    public async validateToken(req: IAuthRequest, res: Response) {
        res.status(200).json({
            success: true,
            message: 'IToken is valid',
            userId: req.userId
        });
    }

    public async refreshToken(req: Request, res: Response): Promise<any> {
        const refreshToken = req.cookies.refresh_cookie;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
            const newAccessToken = this.generateTokens(decoded.userId).accessToken;

            res.cookie('access_cookie', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 1000, // 1m
                sameSite: 'strict',
            });

            return res.status(200).json({
                success: true,
                message: 'Access token refreshed'
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
    }

    public async register(req: Request, res: Response): Promise<any> {
        console.log("Register process started");
        const login: string = req.body.login;
        const password: string = req.body.password;
        const name: string = req.body.name;

        if (!login || !password || !name) {
            return res.status(400).json({
                message: 'login, password and name are required'
            });
        }

        try {
            const existingUser = await this.userRepository.findByLogin(login);
            if (existingUser) {
                return res.status(401).json({
                    message: 'Пользователь уже зарегистрирован.'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await this.userRepository.createUser(
                login,
                hashedPassword,
                name
            );

            const tokens = this.generateTokens(userId);

            this.setCookies(res, tokens);

            return res.status(201).json({
                success: true,
                message: "successful register",
                userId
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return res.status(500).json({
                message: 'Ошибка сервера.'
            });
        }
    }

    public async login(req: Request, res: Response): Promise<any> {
        const login: string = req.body.login;
        const password: string = req.body.password;

        if (!login || !password) {
            return res.status(400).json({
                message: 'login and password are required'
            });
        }

        try {
            const user = await this.userRepository.findByLogin(login);

            if (!user) {
                return res.status(401).json({ success: false, message: 'Пользователь не найден.' });
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Неверный пароль.' });
            }

            // Генерация токенов
            const { accessToken, refreshToken } = this.generateTokens(user.id);

            this.setCookies(res, { accessToken, refreshToken });

            return res.status(200).json({
                success: true,
                message: "successful logging in",
                userId: user.id,
                accessToken,
                refreshToken
            });

        }
        catch (error) {
            console.error("Ошибка при авторизации пользователя", error);
            return res.status(500).json({ success: false, message: 'Ошибка сервера.' });
        }

    }

    private setCookies(res: Response, tokens: IToken) {
        res.cookie('access_cookie', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 1000,
            sameSite: 'strict',
        });

        res.cookie('refresh_cookie', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
            sameSite: 'strict',
        });
    }
}