import { Request, Response } from 'express';
import prisma from '../config/db.config';

export const getAllTransactions = async (req: Request, res: Response): Promise<any> => {

    if (!req?.user) {
        return res.status(401).json({
            message: "Invalid Token Format"
        });
    }

    const getExpenses = await prisma.expense.findMany({
        where: {
            id: req?.user?.id
        }
    });

    const getIncome = await prisma.income.findMany({
        where: {
            id: req?.user?.id,
        }
    })

    const transactions = [...getExpenses, ...getIncome].sort((a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

    return res.status(200).json(transactions);
}

export const addExpense = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, amount, receiverId } = req.body;
        if (!amount || !title || !receiverId) {
            return res.status(400).json({ message: 'Amount and description are required' });
        }

        if (!req?.user?.id) return res.status(401).json({
            message: "Please Login."
        })

        const sender = await prisma.user.findFirst({
            where: {
                id: req.user.id
            }
        });

        if (!sender || !sender.balance || sender.balance < amount) {
            return res.status(403).json({
                message: 'Low Balance',
            });
        }

        const receiver = await prisma.user.findFirst({
            where: {
                id: receiverId
            }
        })

        if (!receiver) {
            return res.status(404).json({
                message: "Reciever User Not Found"
            });
        }

        const newExpense = await prisma.expense.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                senderId: sender.id,
                receiverId: receiver.id,
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

        await prisma.user.update({
            where: {
                id: receiverId,
            },
            data: {
                balance: receiver.balance + Number.parseInt(amount),
                incomes: [...sender.incomes, newExpense.id]
            },
        });

        return res.status(201).json(newExpense);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}