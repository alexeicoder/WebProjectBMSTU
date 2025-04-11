// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { AuthRequest } from '../interfaces/auth.interfaces';

// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//     const token = req.cookies.access_cookie;

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Access token is required'
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid or expired token'
//         });
//     }
// };