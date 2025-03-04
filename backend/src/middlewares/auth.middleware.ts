import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '@/config/validateEnv.config.js';

interface AuthRequest extends Request {
    user?: any;
}

export default function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {
    const token =
        req.header('Authorization')?.split(' ')[1] ||
        req.cookies.authToken;

    if (!token) {
        res
            .status(401)
            .json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const secretKey = env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
        return;
    }
}
