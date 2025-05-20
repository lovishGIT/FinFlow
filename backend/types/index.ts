export interface ChatQuery {
    id: string,
    message: string,
    userId: string,
    createdAt: Date
}

export interface User {
    id: string,
    email: string,
    name: string,
    avatar?: string,
    role: string,
    verified: Boolean,
    token: string,
    password: string,
    balance: number,

    ChatQuery: ChatQuery[],
    expenses: string[],
    incomes: string[],

    createdAt: Date,
    updatedAt: Date,
}

export interface IncomeCSVRow {
    title?: string;
    category?: string;
    description?: string;
    amount: string | number;
    date?: string;
    senderId?: string;
}

export interface ExpenseCSVRow {
    title?: string;
    category?: string;
    description?: string;
    amount: string | number;
    date?: string;
    receiverId?: string;
}