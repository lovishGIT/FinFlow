export interface Expense {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: number;
    date: Date | string;
}

export interface Income {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: number;
    date: Date | string;
}