import { Router, Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
// const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs';
import { Pool, QueryResult } from 'pg';
// import { verifyToken } from '../middleware/auth_middleware';

// Database Configuration
const pool: Pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Interfaces
interface User {
    id: number;
    login: string;
    password: string;
    name: string;
}
type UserQueryResult = QueryResult<User>;

// Router
const router = Router();

// Routes
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Users Service');
});

router.get('/data/:id', async (req: Request, res: Response): Promise<any> => {
    const userId: number = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Valid user ID is required' });
    }

    try {
        const result: UserQueryResult = await pool.query('SELECT id, login, password, name FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

router.get('/all', async (req: Request, res: Response) => {
    try {
        const result: UserQueryResult = await pool.query('SELECT id, login, name FROM users');
        res.status(200).json({
            count: result.rows.length,
            users: result.rows,
        });
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

router.get('/exists/:id', async (req: Request, res: Response): Promise<any> => {
    const userId: number = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Valid user ID is required' });
    }

    try {
        const result: UserQueryResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        return res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        console.error('Ошибка при проверке существования пользователя', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
