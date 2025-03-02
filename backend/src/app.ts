import env from '@/config/validateEnv.config.js';
import express from 'express';
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: env.FRONTEND_URL,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;