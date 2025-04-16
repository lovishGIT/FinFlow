export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: {
        url: string;
        public_id: string;
    };
    password: string;
    balance: number;
    expenses?: Expense[];
    incomes?: Income[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Expense {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: number;
    date: Date | string;
    receiverId?: string;
    receiverEmail?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Income {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: number;
    date: Date | string;
    senderId?: string;
    senderEmail?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Report {
    totalExpenses: number;
    totalIncome: number;
    netSavings: number;
    topExpenseCategories: {
        category: string;
        amount: number;
        percentage: number;
    }[];
    monthlyData: {
        month: string;
        expenses: number;
        income: number;
        savings: number;
    }[];
    dailyData: {
        date: string;
        expenses: number;
        income: number;
    }[];
};
