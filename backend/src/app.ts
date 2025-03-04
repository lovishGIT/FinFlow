import env from '@/config/validateEnv.config.js';
import express from 'express';
import cors from "cors";
import routes from '@/routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: env.FRONTEND_URL,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

export default app;