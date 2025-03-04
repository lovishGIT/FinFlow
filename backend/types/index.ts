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
    role: string,
    verified: Boolean,
    token: string,
    password: string,
    balance: GLfloat,

    ChatQuery: ChatQuery[],
    expenses: string[],
    incomes: string[],

    createdAt: Date,
    updatedAt: Date,
}