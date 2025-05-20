import { Expense, Income, Subscription, User } from '@/types';
import { fetcher } from '@/lib/api.utils';

export const fetchUserService = async ({ setUser }: {
    setUser: (user: User) => void;
}) => {
    const userData = await fetcher<User>('/api/auth/me');

    if (!userData) {
        throw new Error('Invalid User Data');
    }

    setUser(userData);
};

export const fetchTransactionsService = async ({ setExpenses, setIncomes }: {
    setExpenses: (expenses: Expense[]) => void;
    setIncomes: (incomes: Income[]) => void;
}) => {
    const transactions = await fetcher<{
        expenses: Expense[];
        incomes: Income[];
    }>('/api/money/transactions');

    console.log('Transactions Data: ', transactions);

    const { expenses, incomes } = transactions || {
        expenses: [],
        incomes: [],
    };

    if (!expenses && !incomes) throw new Error('Invalid Transactions Data');

    setExpenses(expenses || []);
    setIncomes(incomes || []);
};

// Expense Services

export async function addExpenseService(expense: Partial<Expense>, addExpense: (expenses: Expense) => void) {
    const newExpense = await fetcher<Expense>(`/api/money/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
        credentials: 'include',
    });

    if (!newExpense) throw new Error('Failed to add expense');

    addExpense(newExpense);
    return newExpense;
};

export async function updateExpenseService(
    id: string,
    updatedExpense: Partial<Expense>,
    updateExpense: (id: string, updatedExpense: Partial<Expense>) => void
) {
    const newUpdatedExpense = await fetcher(`/api/money/expenses?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExpense),
    });

    if (!newUpdatedExpense) throw new Error('Failed to update expense');

    updateExpense(id, updatedExpense);
};

export async function deleteExpenseService(id: string, deleteExpense: (id: string) => void) {
    const deletedExpense = await fetcher(`/api/money/expenses?id=${id}`, {
        method: 'DELETE',
    });

    if (!deletedExpense) throw new Error('Failed to delete expense');

    deleteExpense(id);
};

// Income Services

export async function addIncomeService(income: Partial<Income>, addIncome: (income: Income) => void) {
    const newIncome = await fetcher<Income>(`/api/money/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income),
    });

    if (!newIncome) throw new Error('Failed to add income');

    addIncome(newIncome);
    return newIncome;
};

export async function updateIncomeService(
    id: string,
    updatedIncome: Partial<Income>,
    updateIncome: (id: string, updatedIncome: Partial<Income>) => void
) {
    const newUpdatedIncome = await fetcher(`/api/money/incomes?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIncome),
    });

    if (!newUpdatedIncome) throw new Error('Failed to update income');

    updateIncome(id, updatedIncome);
};

export async function deleteIncomeService(id: string, deleteIncome: (id: string) => void) {
    const deletedIncome = await fetcher(`/api/money/incomes?id=${id}`, {
        method: 'DELETE',
    });

    if (!deletedIncome) throw new Error('Failed to delete income');

    deleteIncome(id);
};

// Subscription Services

export async function fetchSubscriptionsService(setSubscriptions: (subscriptions: Subscription[]) => void) {
    const subscriptions = await fetcher<Subscription[]>(
        '/api/subscriptions'
    );

    console.log('Subscriptions Data: ', subscriptions);

    if (!subscriptions) {
        throw new Error('Invalid Subscriptions Data');
    }

    setSubscriptions(subscriptions || []);
};

// Fetch a single subscription by ID
export async function fetchSubscriptionByIdService ( id: string, setSubscription: (subscription: Subscription) => void) {
    const subscription = await fetcher<Subscription>(`/api/subscriptions/${id}`);

    if (!subscription) {
        throw new Error('Invalid Subscription Data');
    }

    setSubscription(subscription);
};

// Add a new subscription
export async function addSubscriptionService(
    subscription: Partial<Subscription>,
    addSubscription: (subscription: Subscription) => void
) {
    const newSubscription = await fetcher<Subscription>('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
        credentials: 'include',
    });

    if (!newSubscription) throw new Error('Failed to add subscription');

    addSubscription(newSubscription);
    return newSubscription;
};

// Update an existing subscription
export async function updateSubscriptionService(
    id: string,
    updatedSubscription: Partial<Subscription>,
    updateSubscription: (id: string, updatedSubscription: Partial<Subscription>) => void
) {
    const newUpdatedSubscription = await fetcher(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSubscription),
    });

    if (!newUpdatedSubscription) throw new Error('Failed to update subscription');

    updateSubscription(id, updatedSubscription);
};

// Toggle subscription status (active/inactive/cancelled)
export async function toggleSubscriptionService(
    id: string,
    updateSubscription: (id: string, updatedSubscription: Partial<Subscription>) => void
) {
    const toggledSubscription = await fetcher<Subscription>(`/api/subscriptions/toggle/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!toggledSubscription) throw new Error('Failed to toggle subscription');

    // Update the subscription in the state with the returned data
    updateSubscription(id, toggledSubscription);

    return toggledSubscription;
};