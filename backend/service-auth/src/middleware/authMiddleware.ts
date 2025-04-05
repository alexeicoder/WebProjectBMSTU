import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/request';

export const generateTokens = (userId: number): { accessToken: string; refreshToken: string } => {
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

export const verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies.access_cookie;

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No token provided'
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: number };

        req.userId = decoded.userId;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

