export interface Expense {
    id: string,
    title: string,
    category: string,
    description: string,
    amount: number,
    date: Date | string,
}

export interface Income {
    id: string,
    title: string,
    category: string,
    description: string,
    amount: number,
    date: Date | string,
}

export interface User {
    id: string,
    name: string,
    email: string,
    avatar?: {
        url: string,
        public_id: string,
    },
    password: string,
    balance: number,
    expenses?: Expense[],
    incomes?: Income[],
    createdAt?: Date | string,
    updatedAt?: Date | string,
}