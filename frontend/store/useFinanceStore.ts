import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, Income } from '@/types';

interface FinanceState {
    expenses: Expense[];
    incomes: Income[];
    isLoading: boolean;

    // Actions
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (
        id: string,
        updatedExpense: Partial<Expense>
    ) => void;
    deleteExpense: (id: string) => void;

    setIncomes: (incomes: Income[]) => void;
    addIncome: (income: Income) => void;
    updateIncome: (
        id: string,
        updatedIncome: Partial<Income>
    ) => void;
    deleteIncome: (id: string) => void;

    setLoading: (loading: boolean) => void;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set) => ({
            expenses: [],
            incomes: [],
            isLoading: false,

            setExpenses: (expenses) => set({ expenses }),
            addExpense: (expense) =>
                set((state) => ({
                    expenses: [...state.expenses, expense],
                })),
            updateExpense: (id, updatedExpense) =>
                set((state) => ({
                    expenses: state.expenses.map((expense) =>
                        expense.id === id
                            ? { ...expense, ...updatedExpense }
                            : expense
                    ),
                })),
            deleteExpense: (id) =>
                set((state) => ({
                    expenses: state.expenses.filter(
                        (expense) => expense.id !== id
                    ),
                })),

            setIncomes: (incomes) => set({ incomes }),
            addIncome: (income) =>
                set((state) => ({
                    incomes: [...state.incomes, income],
                })),
            updateIncome: (id, updatedIncome) =>
                set((state) => ({
                    incomes: state.incomes.map((income) =>
                        income.id === id
                            ? { ...income, ...updatedIncome }
                            : income
                    ),
                })),
            deleteIncome: (id) =>
                set((state) => ({
                    incomes: state.incomes.filter(
                        (income) => income.id !== id
                    ),
                })),

            setLoading: (loading) => set({ isLoading: loading })
        }),
        {
            name: 'finance-storage',
        }
    )
);
