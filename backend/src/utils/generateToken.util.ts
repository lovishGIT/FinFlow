import jwt, { SignOptions } from 'jsonwebtoken';
import env from '@/config/validateEnv.config.js';

const generateToken = (userId: string, expiresIn: SignOptions['expiresIn'] = '1h'
): string => {
    const secretKey = env.JWT_SECRET as jwt.Secret;

    const options: SignOptions = { expiresIn };
    const token = jwt.sign({ id: userId }, secretKey, options);
    return token;
};

export default generateToken;
