import { Request, Response } from 'express';
import prisma from '@/config/db.config.js';

export const getAllTransactions = async (
    req: Request,
    res: Response
): Promise<any> => {
    if (!req?.user) {
        return res.status(401).json({
            message: 'Invalid Token Format',
        });
    }

    const getExpenses = await prisma.expense.findMany({
        where: {
            senderId: req?.user?.id,
        },
    });

    const getIncome = await prisma.income.findMany({
        where: {
            receiverId: req?.user?.id,
        },
    });

    return res.status(200).json({
        expenses: getExpenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        incomes: getIncome.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    });
};

export const addExpense = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user?.id)
            return res.status(401).json({
                message: 'Please Login.',
            });

        const {
            title,
            category,
            description,
            amount,
            receiverId, receiverEmail,
            date,
        } = req.body;
        if (!amount || (!receiverEmail && !receiverId)) {
            return res.status(400).json({
                message: 'Amount & Reciever are required',
            });
        }

        const sender = await prisma.user.findFirst({
            where: {
                id: req.user.id,
            },
        });

        if (!sender) {
            return res.status(404).json({
                message: 'Sender Not Found',
            });
        }

        if (!sender.balance || sender.balance < amount) {
            return res.status(403).json({
                message: 'Low Balance',
            });
        }

        const receiver = await prisma.user.findFirst({
            where: {
                OR: [{ id: receiverId }, { email: receiverEmail }],
            },
        });

        if (!receiver) {
            return res.status(404).json({
                message: 'Reciever Not Found',
            });
        }

        const newExpense = await prisma.expense.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                senderId: sender.id,
                receiverId: receiver.id,
                date: date ? new Date(date) : new Date()
            },
        });

        await prisma.user.update({
            where: {
                id: sender.id,
            },
            data: {
                balance: sender.balance - Number.parseInt(amount),
                expenses: [...sender.expenses, newExpense.id],
            },
        });

        const newIncome = await prisma.income.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                senderId: sender.id,
                receiverId: receiver.id,
                date: date ? new Date(date) : new Date()
            },
        });

        if (receiver) {
            await prisma.user.update({
                where: {
                    id: receiver.id,
                },
                data: {
                    balance:
                        receiver.balance + Number.parseInt(amount),
                    incomes: [...sender.incomes, newIncome.id],
                },
            });
        } else {
            console.log('Receiver not found, unable to update balance');
        }

        return res.status(201).json({
            message: "Expense Added Successfully..."
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

export const getExpenseById = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const expense = await prisma.expense.findUnique({
            where: { id },
        });
        if (!expense) {
            return res
                .status(404)
                .json({ message: 'Expense not found' });
        }
        return res.status(200).json(expense);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const updateExpense = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const { title, category, description, amount, date } = req.body;

        // Find the existing expense
        const existingExpense = await prisma.expense.findUnique({
            where: { id },
        });
        if (!existingExpense) {
            return res
                .status(404)
                .json({ message: 'Expense not found' });
        }

        // Optional: Verify that the expense belongs to the logged-in user (sender)
        if (existingExpense.senderId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to update this expense',
            });
        }

        // Update the expense record
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: {
                title: title || existingExpense.title,
                category: category || existingExpense.category,
                description:
                    description || existingExpense.description,
                amount: amount
                    ? Number.parseInt(amount)
                    : existingExpense.amount,
                date: date ? new Date(date) : existingExpense.date
            },
        });
        return res.status(200).json(updatedExpense);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const deleteExpense = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const existingExpense = await prisma.expense.findUnique({
            where: { id },
        });
        if (!existingExpense) {
            return res
                .status(404)
                .json({ message: 'Expense not found' });
        }
        // Optional: Check ownership before deletion
        if (existingExpense.senderId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to delete this expense',
            });
        }
        await prisma.expense.delete({
            where: { id },
        });
        return res
            .status(200)
            .json({ message: 'Expense deleted successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const addIncome = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user?.id) {
            return res.status(401).json({ message: 'Please Login.' });
        }
        const { title, category, description, amount, senderId, senderEmail, date } = req.body;
        if (!amount && (!senderId || !senderEmail)) {
            return res.status(400).json({
                message: 'Amount and sender information are required',
            });
        }

        const sender = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: senderId },
                    { email: senderEmail },
                ],
            },
        });
        if (!sender) {
            return res
                .status(404)
                .json({ message: 'Sender Not Found' });
        }

        console.log('Sender:', sender);

        // Create income record
        const newIncome = await prisma.income.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                senderId: sender.id,
                receiverId: req.user.id,
                date: date ? new Date(date) : new Date()
            },
        });

        // Update receiver balance & income list
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                balance: { increment: Number.parseInt(amount) },
                incomes: { push: newIncome.id },
            },
        });

        const newExpense = await prisma.expense.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                senderId: sender.id,
                receiverId: req.user.id,
                date: date ? new Date(date) : new Date()
            },
        });

        // Optionally, update sender records if needed (e.g., expenses or other records)
        await prisma.user.update({
            where: { id: sender.id },
            data: {
                balance: { decrement: Number.parseInt(amount) },
                expenses: { push: newExpense.id },
            },
        });

        return res.status(201).json({
            message: "Income Added Successfully..."
        });
    } catch (error) {
        console.log("Error", error);
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const getIncomeById = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const income = await prisma.income.findUnique({
            where: { id },
        });
        if (!income) {
            return res
                .status(404)
                .json({ message: 'Income record not found' });
        }
        return res.status(200).json(income);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const updateIncome = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const { title, category, description, amount, date } = req.body;

        const existingIncome = await prisma.income.findUnique({
            where: { id },
        });
        if (!existingIncome) {
            return res
                .status(404)
                .json({ message: 'Income record not found' });
        }
        // Optional: Verify that the income belongs to the logged-in user (receiver)
        if (existingIncome.receiverId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to update this income',
            });
        }

        const updatedIncome = await prisma.income.update({
            where: { id },
            data: {
                title: title || existingIncome.title,
                category: category || existingIncome.category,
                description:
                    description || existingIncome.description,
                amount: amount
                    ? Number.parseInt(amount)
                    : existingIncome.amount,
                date: date ? new Date(date) :  existingIncome.date,
            },
        });
        return res.status(200).json(updatedIncome);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

export const deleteIncome = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req?.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const existingIncome = await prisma.income.findUnique({
            where: { id },
        });
        if (!existingIncome) {
            return res
                .status(404)
                .json({ message: 'Income record not found' });
        }
        // Optional: Verify ownership
        if (existingIncome.receiverId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to delete this income',
            });
        }
        await prisma.income.delete({
            where: { id },
        });
        return res
            .status(200)
            .json({ message: 'Income record deleted successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};