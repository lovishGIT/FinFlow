import { Router } from "express";
import * as authController from "@/controllers/auth.controller.js";

const router = Router();

router.route('/login').post(authController.loginController);
router.route('/register').post(authController.registerController);
router
    .route('/verify-user')
    .post(authController.verifyUser);

export default router;