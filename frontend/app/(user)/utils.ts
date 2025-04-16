import { Expense, Income, Report } from '@/types/index';
import {
    format,
    parseISO,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    subMonths,
} from 'date-fns';

// Generate financial report data
export function generateReport(
    expenses: Expense[],
    incomes: Income[],
    timeframe: 'week' | 'month' | 'year' = 'month'
): Report {
    // Calculate total expenses and income
    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );
    const totalIncome = incomes.reduce(
        (sum, income) => sum + income.amount,
        0
    );
    const netSavings = totalIncome - totalExpenses;

    // Calculate top expense categories
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((expense) => {
        expensesByCategory[expense.category] =
            (expensesByCategory[expense.category] || 0) +
            expense.amount;
    });

    const topExpenseCategories = Object.entries(expensesByCategory)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage:
                totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Generate monthly data for the past year
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = subMonths(new Date(), i);
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        const monthExpenses = expenses
            .filter((expense) => {
                const expenseDate =
                    typeof expense.date === 'string'
                        ? parseISO(expense.date)
                        : expense.date;
                return (
                    expenseDate >= monthStart &&
                    expenseDate <= monthEnd
                );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        const monthIncome = incomes
            .filter((income) => {
                const incomeDate =
                    typeof income.date === 'string'
                        ? parseISO(income.date)
                        : income.date;
                return (
                    incomeDate >= monthStart && incomeDate <= monthEnd
                );
            })
            .reduce((sum, income) => sum + income.amount, 0);

        return {
            month: format(month, 'MMM yyyy'),
            expenses: monthExpenses,
            income: monthIncome,
            savings: monthIncome - monthExpenses,
        };
    }).reverse();

    // Generate daily data for current month
    const today = new Date();
    const daysInCurrentMonth = eachDayOfInterval({
        start: startOfMonth(today),
        end: today,
    });

    const dailyData = daysInCurrentMonth.map((day) => {
        const dayExpenses = expenses
            .filter((expense) => {
                const expenseDate =
                    typeof expense.date === 'string'
                        ? parseISO(expense.date)
                        : expense.date;
                return (
                    format(expenseDate, 'yyyy-MM-dd') ===
                    format(day, 'yyyy-MM-dd')
                );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        const dayIncome = incomes
            .filter((income) => {
                const incomeDate =
                    typeof income.date === 'string'
                        ? parseISO(income.date)
                        : income.date;
                return (
                    format(incomeDate, 'yyyy-MM-dd') ===
                    format(day, 'yyyy-MM-dd')
                );
            })
            .reduce((sum, income) => sum + income.amount, 0);

        return {
            date: format(day, 'dd MMM'),
            expenses: dayExpenses,
            income: dayIncome,
        };
    });

    return {
        totalExpenses,
        totalIncome,
        netSavings,
        topExpenseCategories,
        monthlyData,
        dailyData,
    };
};

// Calculate current balance
export function calculateBalance(
    expenses: Expense[],
    incomes: Income[]
): number {
    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );
    const totalIncome = incomes.reduce(
        (sum, income) => sum + income.amount,
        0
    );
    return totalIncome - totalExpenses;
};

// Format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Get monthly summary
export function getMonthlyData(
    expenses: Expense[],
    incomes: Income[],
    months = 6
): any[] {
    return Array.from({ length: months }, (_, i) => {
        const month = subMonths(new Date(), i);
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        const monthExpenses = expenses
            .filter((expense) => {
                const expenseDate =
                    typeof expense.date === 'string'
                        ? parseISO(expense.date)
                        : expense.date;
                return (
                    expenseDate >= monthStart &&
                    expenseDate <= monthEnd
                );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        const monthIncome = incomes
            .filter((income) => {
                const incomeDate =
                    typeof income.date === 'string'
                        ? parseISO(income.date)
                        : income.date;
                return (
                    incomeDate >= monthStart && incomeDate <= monthEnd
                );
            })
            .reduce((sum, income) => sum + income.amount, 0);

        return {
            month: format(month, 'MMM yyyy'),
            expenses: monthExpenses,
            income: monthIncome,
            savings: monthIncome - monthExpenses,
        };
    }).reverse();
};