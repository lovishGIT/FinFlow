import { Router } from "express";
import authRoutes from "./auth.routes.js";
import moneyRoutes from "./money.routes.js";
import subscriptionRoutes from "./subscriptions.routes.js";
import authMiddleware from "@/middlewares/auth.middleware.js";

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/money', authMiddleware, moneyRoutes);
routes.use('/subscriptions', authMiddleware, subscriptionRoutes);

export default routes;