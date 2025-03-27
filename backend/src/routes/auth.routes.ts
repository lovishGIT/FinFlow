import { Router } from "express";
import * as authController from "@/controllers/auth.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import upload from "@/middlewares/upload.middleware.js";

const router = Router();

router.route('/register').post(authController.registerController);
router.route('/verify-user').post(authController.verifyUser);

router.route('/login').post(authController.loginController);
router.route('/logout').post(authMiddleware, authController.logoutController);

router.route('/forgot-password-request').post(authController.forgetPasswordRequestController);
router.route('/reset-password').post(authController.resetPasswordController);

// User routes
router.route('/me')
    .get(authMiddleware, authController.getUserController)
    .patch(upload.single("avatar"), authMiddleware, authController.updateUserController);

export default router;