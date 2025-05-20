import { Router } from 'express';
import * as moneyController from '@/controllers/money.controller.js';
import upload from '../middlewares/upload.middleware';

const router = Router();

router
    .route('/all')
    .get(moneyController.getAllTransactions);

router
    .route('/expense')
    .post(moneyController.addExpense);

router
    .route('/expense/:id')
    .get(moneyController.getExpenseById)
    .put(moneyController.updateExpense)
    .delete(moneyController.deleteExpense);

router
    .route('/expense/csv')
    .post(upload.single('file'), moneyController.uploadExpenseCSV);
    
router
    .route('/income')
    .post(moneyController.addIncome);

router
    .route('/income/:id')
    .get(moneyController.getIncomeById)
    .put(moneyController.updateIncome)
    .delete(moneyController.deleteIncome);

router
    .route("/income/csv")
    .post(upload.single("file"), moneyController.uploadIncomeCSV);

export default router;