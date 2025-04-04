import { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { verifyToken } from '../middleware/auth_middleware';

//  DATABASE CONFIGURATION
const pool: Pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

//  INTERFACES
interface User {
    id: number;
    login: string;
    password: string;
    name: string;
}

interface TokenPayload {
    userId: number;
}

interface AuthenticatedRequest extends Request {
    userId?: number;
}

const generateTokens = (userId: number): { accessToken: string; refreshToken: string } => {
    const accessToken: string = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '1m' }
    );

    const refreshToken: string = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '1h' }
    );

    return { accessToken, refreshToken };
};

// ROUTER
const router = Router();

// Routes
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Auth Service');
});

router.get('/validatetoken', verifyToken, (req: Request, res: Response): any => {
    res.status(200).json({
        success: true,
        message: 'Token is valid',
        userId: (req as any).userId
    });
});

router.post('/refresh', (req: Request, res: Response): any => {
    const refreshToken = req.cookies.refresh_cookie as string | undefined;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
        const newAccessToken: string = generateTokens(decoded.userId).accessToken;

        res.cookie('access_cookie', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 1000,
            sameSite: 'strict',
        });

        return res.status(200).json({ success: true, message: 'Access token refreshed' });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
});

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    const { login, password, name }: { login: string; password: string; name: string } = req.body;

    if (!login || !password || !name) {
        return res.status(400).json({ message: 'login, password and name are required' });
    }

    try {
        const userResult = await pool.query<User>('SELECT * FROM users WHERE login = $1', [login]);

        if (userResult.rows[0]) {
            return res.status(401).json({ message: 'Пользователь уже зарегистрирован.' });
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
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { login, password }: { login: string; password: string } = req.body;

    if (!login || !password) {
        return res.status(400).json({ success: false, message: 'login and password are required' });
    }

    try {
        const result = await pool.query<User>('SELECT * FROM users WHERE login = $1', [login]);
        const user: User | undefined = result.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'Пользователь не найден.' });
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Неверный пароль.' });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

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

        res.status(200).json({
            success: true,
            message: "successful logging in",
            userId: user.id
        });
    } catch (error) {
        console.error("Ошибка при авторизации пользователя", error);
        res.status(500).json({ success: false, message: 'Ошибка сервера.' });
    }
});

router.get('/data/:id', async (req: Request, res: Response): Promise<any> => {
    const userId: number = parseInt(req.params.id);

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Valid user ID is required' });
    }

    try {
        const result = await pool.query<User>('SELECT id, login, password, name FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

router.get('/all', async (req: Request, res: Response) => {
    try {
        const result = await pool.query<User>('SELECT * FROM users');
        res.status(200).json({
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

router.get('/exists/:id', async (req: Request, res: Response) => {
    const userId: number = parseInt(req.params.id);

    try {
        const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal server error' });
    }
});

router.post('/signout', (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({ message: 'Ошибка при выходе из системы' });
    }
});

export default router;