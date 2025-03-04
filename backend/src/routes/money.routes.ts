import { Router } from "express";
import * as moneyController from "@/controllers/money.controller.js";

const router = Router();

router.route('/all').get(moneyController.getAllTransactions);
router.route('/addExpense').post(moneyController.addExpense);

export default router;