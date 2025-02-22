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
});

export default env;