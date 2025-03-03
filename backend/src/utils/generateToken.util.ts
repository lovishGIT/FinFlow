import jwt from 'jsonwebtoken';
import env from '@/config/validateEnv.config.js';

const generateToken = (userId: string): string => {
    const secretKey = env.JWT_SECRET;
    const expiresIn = '1h';

    const token = jwt.sign({ id: userId }, secretKey, { expiresIn });
    return token;
};

export default generateToken;