import dotenv from 'dotenv';
dotenv.config();

import { cleanEnv, str, num } from "envalid";

const env = cleanEnv(process.env, {
    DATABASE_URL: str(),
    PORT: num({
        devDefault: 4000,
    }),

    FRONTEND_URL: str({
        default: 'http://localhost:3000',
    }),
    JWT_SECRET: str({
        devDefault: 'hello this is jwt secret',
    }),

    NODE_ENV: str({
        default: 'development',
    }),

    CLOUDINARY_NAME: str({
        devDefault: 'stop-this-service',
    }),
    CLOUDINARY_API_KEY: str({
        devDefault: 'stop-this-service',
    }),
    CLOUDINARY_API_SECRET: str({
        devDefault: 'stop-this-service',
    }),

    EMAIL_EMAIL: str({
        default: 'stop-this-service',
    }),
    EMAIL_PASSWORD: str({
        default: 'stop-this-service',
    }),
});

export default env;