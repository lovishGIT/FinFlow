import * as fs from "fs";
import { parse } from 'papaparse';

import { Request, Response } from 'express';
import prisma from '@/config/db.config.js';

import { IncomeCSVRow, ExpenseCSVRow } from '@/../types/index.js';
import { validateExpenseRow, validateIncomeRow } from '@/utils/validateCSV.util.js';


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
            date,
        } = req.body;


        if (!amount) {
            return res.status(400).json({
                message: 'Amount is required',
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

        const newExpense = await prisma.expense.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                senderId: sender.id,
                date: date ? new Date(date) : new Date()
            },
        });

        await prisma.user.update({
            where: {
                id: sender.id,
            },
            data: {
                expenses: [...sender.expenses, newExpense.id],
            },
        });

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

        const existingExpense = await prisma.expense.findUnique({
            where: { id },
        });
        if (!existingExpense) {
            return res
                .status(404)
                .json({ message: 'Expense not found' });
        }

        if (existingExpense.senderId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to update this expense',
            });
        }

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
        const { title, category, description, amount, date } = req.body;
        if (!amount) {
            return res.status(400).json({
                message: 'Amount and sender information are required',
            });
        };

        const newIncome = await prisma.income.create({
            data: {
                amount: Number.parseInt(amount),
                title,
                category,
                description,
                receiverId: req.user.id,
                date: date ? new Date(date) : new Date()
            },
        });

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                incomes: { push: newIncome.id },
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
                amount: amount ? Number.parseInt(amount)
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

export const uploadIncomeCSV = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Please Login.' });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ message: 'No file uploaded' });
        }

        const csvFilePath = req.file.path;
        const fileContent = fs.readFileSync(csvFilePath, 'utf8');

        // Parse the CSV file
        parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: async (results) => {
                const { data, errors } = results;

                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Error parsing CSV file',
                        errors,
                    });
                }

                const validRows: IncomeCSVRow[] = [];
                const invalidRows: IncomeCSVRow[] = [];

                // Validate each row
                data.forEach((row: any) => {
                    if (validateIncomeRow(row)) {
                        validRows.push(row);
                    } else {
                        invalidRows.push(row);
                    }
                });

                // Process valid rows and add to database
                try {
                    const createdIncomes = await prisma.$transaction(
                        validRows.map((row) => {
                            return prisma.income.create({
                                data: {
                                    amount: Number(row.amount),
                                    title:
                                        row.title || 'Miscellaneous',
                                    category:
                                        row.category || 'Others',
                                    description:
                                        row.description || null,
                                    senderId: row.senderId || null,
                                    receiverId: req.user!.id,
                                    date: row.date
                                        ? new Date(row.date)
                                        : new Date(),
                                },
                            });
                        })
                    );

                    // Update user with new income IDs
                    if (createdIncomes.length > 0) {
                        const incomeIds = createdIncomes.map(
                            (income) => income.id
                        );

                        await prisma.user.update({
                            where: { id: req.user?.id },
                            data: {
                                incomes: {
                                    push: incomeIds,
                                },
                            },
                        });
                    }

                    // Clean up the uploaded file
                    fs.unlinkSync(csvFilePath);

                    return res.status(201).json({
                        message: 'Income data uploaded successfully',
                        totalRows: data.length,
                        successfulRows: validRows.length,
                        failedRows: invalidRows.length,
                        failures:
                            invalidRows.length > 0
                                ? invalidRows
                                : undefined,
                    });
                } catch (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({
                        message: 'Error saving data to database',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    });
                }
            },
            error: (error: Error) => {
                console.error('CSV parsing error:', error);
                return res.status(400).json({
                    message: 'Error parsing CSV file',
                    error: error.message,
                });
            },
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error',
        });
    }
};


export const uploadExpenseCSV = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Please Login.' });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ message: 'No file uploaded' });
        }

        const csvFilePath = req.file.path;
        const fileContent = fs.readFileSync(csvFilePath, 'utf8');

        // Parse the CSV file
        parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: async (results) => {
                const { data, errors } = results;

                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Error parsing CSV file',
                        errors,
                    });
                }

                const validRows: ExpenseCSVRow[] = [];
                const invalidRows: ExpenseCSVRow[] = [];

                // Validate each row
                data.forEach((row: any) => {
                    if (validateExpenseRow(row)) {
                        validRows.push(row);
                    } else {
                        invalidRows.push(row);
                    }
                });

                // Process valid rows and add to database
                try {
                    const user = await prisma.user.findFirst({
                        where: { id: req.user!.id },
                    });

                    if (!user) {
                        return res.status(404).json({
                            message: 'User Not Found',
                        });
                    }

                    const createdExpenses = await prisma.$transaction(
                        validRows.map((row) => {
                            return prisma.expense.create({
                                data: {
                                    amount: Number(row.amount),
                                    title:
                                        row.title || 'Miscellaneous',
                                    category:
                                        row.category || 'Others',
                                    description:
                                        row.description || null,
                                    senderId: req.user!.id,
                                    receiverId:
                                        row.receiverId || null,
                                    date: row.date
                                        ? new Date(row.date)
                                        : new Date(),
                                },
                            });
                        })
                    );

                    // Update user with new expense IDs
                    if (createdExpenses.length > 0) {
                        const expenseIds = createdExpenses.map(
                            (expense) => expense.id
                        );
                        const currentExpenses = user.expenses || [];

                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                expenses: [
                                    ...currentExpenses,
                                    ...expenseIds,
                                ],
                            },
                        });
                    }

                    // Clean up the uploaded file
                    fs.unlinkSync(csvFilePath);

                    return res.status(201).json({
                        message: 'Expense data uploaded successfully',
                        totalRows: data.length,
                        successfulRows: validRows.length,
                        failedRows: invalidRows.length,
                        failures:
                            invalidRows.length > 0
                                ? invalidRows
                                : undefined,
                    });
                } catch (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({
                        message: 'Error saving data to database',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    });
                }
            },
            error: (error: Error) => {
                console.error('CSV parsing error:', error);
                return res.status(400).json({
                    message: 'Error parsing CSV file',
                    error: error.message,
                });
            },
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error',
        });
    }
};