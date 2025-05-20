'use client';
import React, { useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    BarChart as BarChartIcon,
    Plus,
    Edit,
    Trash2,
    Loader2,
} from 'lucide-react';
import { Expense, Income } from '@/types/index';
import FormDialog from '@/components/dashboard/formDailog';
import { useFinanceStore } from '@/store/useFinanceStore';
import { toast } from 'sonner';
import {
    addExpenseService,
    addIncomeService,
    updateExpenseService,
    updateIncomeService,
    deleteExpenseService,
    deleteIncomeService,
} from '../services';

const expenseCategories = [
    'Groceries',
    'Dining Out',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Other',
];

const incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Rental Income',
    'Side Hustle',
    'Other',
];

type ItemWithType = (Expense | Income) & { type: string };

const FinanceDashboard = () => {
    // Get data from Zustand stores
    const { expenses, incomes, isLoading, setExpenses, setIncomes, addExpense, addIncome, updateExpense, updateIncome, deleteExpense, deleteIncome } = useFinanceStore();

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedItem, setSelectedItem] = useState<ItemWithType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogMode, setDialogMode] = useState<string>('add');
    const [formData, setFormData] = useState<Partial<Expense | Income>>({
        title: '',
        category: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const totalExpenses =
        expenses?.reduce(
            (sum, expense) => sum + Number(expense.amount),
            0
        ) || 0;
    const totalIncomes =
        incomes?.reduce(
            (sum, income) => sum + Number(income.amount),
            0
        ) || 0;
    const netBalance = totalIncomes - totalExpenses;

    const monthlyData = useMemo(() => {
        if (!expenses || !incomes) return [];

        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        const monthlyData: {
            month: string;
            expenses: number;
            income: number;
        }[] = [];

        monthNames.forEach((month, index) => {
            monthlyData[index] = {
                month,
                expenses: 0,
                income: 0,
            };
        });

        expenses.forEach((expense) => {
            const date = new Date(expense.date);
            const monthIndex = date.getMonth();
            if (!monthlyData[monthIndex]?.expenses) {
                monthlyData[monthIndex] = {
                    ...monthlyData[monthIndex],
                    expenses: Number(expense.amount),
                };
            } else {
                monthlyData[monthIndex].expenses += Number(
                    expense.amount
                );
            }
        });

        incomes.forEach((income) => {
            const date = new Date(income.date);
            const monthIndex = date.getMonth();
            if (!monthlyData[monthIndex - 1]?.income) {
                // console.log('error', monthIndex - 1, monthlyData[monthIndex - 1]);
                monthlyData[monthIndex - 1] = {
                    ...monthlyData[monthIndex - 1],
                    income: Number(income.amount),
                };
            } else {
                monthlyData[monthIndex - 1].income += Number(
                    income.amount
                );
            }
        });

        return monthlyData.filter(
            (item) => item.expenses > 0 || item.income > 0
        );
    }, [expenses, incomes]);

    const handleAddNew = (type: string) => {
        setDialogMode('add');
        setFormData({
            title: '',
            category: '',
            description: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
        });
        setSelectedItem(null);
        setActiveTab(type);
        setIsDialogOpen(true);
    };

    const handleCsvUpload = () => {
        toast.error(
            'CSV upload feature is in progress yet.'
        );
    }

    const handleEdit = (item: Partial<Expense | Income>, type: string) => {
        setDialogMode('edit');
        setFormData({
            title: item.title,
            category: item.category,
            description: item.description,
            amount: Number(item.amount),
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
        setSelectedItem({ ...(item as ItemWithType), type });
        setActiveTab(type);
        setIsDialogOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        let { name, value, type }: {
            name: string;
            value: string | number | undefined | Date;
            type: string;
        } = e.target;

        if (type === 'date') {
            value = new Date(value);
        }
        else if (name === 'amount') {
            value = parseFloat(value as string) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value as string) || 0 : value,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            const newItem = {
                id: selectedItem ? selectedItem.id : Date.now().toString(),
                title: formData.title || '',
                category: formData.category || '',
                description: formData.description || '',
                amount: Number(formData.amount) || 0,
                date: formData.date || new Date().toISOString().split('T')[0],
            };

            if (dialogMode === 'add') {
                if (activeTab === 'expense') {
                    await addExpenseService(newItem as Expense, addExpense);
                    setExpenses([
                        ...(expenses || []),
                        newItem as Expense,
                    ]);
                    toast.success('Expense added successfully');
                } else {
                    await addIncomeService(newItem as Income, addIncome);
                    setIncomes([
                        ...(incomes || []),
                        newItem as Income,
                    ]);
                    toast.success('Income added successfully');
                }
            } else {
                if (activeTab === 'expense' && selectedItem) {
                    // Assuming updateExpense is an API call to update expense
                    await updateExpenseService(
                        selectedItem.id,
                        newItem as Expense,
                        updateExpense
                    );
                    setExpenses(
                        (expenses || []).map((item) =>
                            item.id === selectedItem.id
                                ? (newItem as Expense)
                                : item
                        )
                    );
                    toast.success('Expense updated successfully');
                } else if (activeTab === 'income' && selectedItem) {
                    await updateIncomeService(
                        selectedItem.id,
                        newItem as Income,
                        updateIncome
                    );
                    setIncomes(
                        (incomes || []).map((item) =>
                            item.id === selectedItem.id
                                ? (newItem as Income)
                                : item
                        )
                    );
                    toast.success('Income updated successfully');
                }
            }
        } catch (error: any) {
            console.error('Error saving data:', error);
            toast.error(
                error?.message || 'Failed to save. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
            setIsDialogOpen(false);
        }
    };

    // Remove an item
    const handleRemove = async (id: string, type: string) => {
        try {
            if (type === 'expense') {
                // Assuming deleteExpense is an API call to delete expense
                await deleteExpenseService(id, deleteExpense);
                setExpenses(
                    (expenses || []).filter((item) => item.id !== id)
                );
                toast.success('Expense deleted successfully');
            } else {
                // Assuming deleteIncome is an API call to delete income
                await deleteIncomeService(id, deleteIncome);
                setIncomes(
                    (incomes || []).filter((item) => item.id !== id)
                );
                toast.success('Income deleted successfully');
            }
        } catch (error: any) {
            console.error('Error deleting item:', error);
            toast.error(
                error?.message ||
                    'Failed to delete. Please try again.'
            );
        }
    };

    const renderTable = (
        items: Expense[] | Income[] | undefined,
        type: string
    ) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {type === 'expense'
                        ? 'Recent Expenses'
                        : 'Recent Incomes'}
                </CardTitle>
                <Button
                    variant="outline"
                    onClick={() => handleAddNew(type)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : items && items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Amount
                                </TableHead>
                                <TableHead className="text-right">
                                    Date
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.title}
                                    </TableCell>
                                    <TableCell>
                                        {item.category}
                                    </TableCell>
                                    <TableCell>
                                        {item.description}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${
                                            type === 'expense'
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        {type === 'expense'
                                            ? '-'
                                            : '+'}
                                        ₹
                                        {Number(item.amount)?.toFixed(
                                            2
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(
                                            item.date
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(
                                                        item,
                                                        type
                                                    )
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.id,
                                                        type
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No{' '}
                        {type === 'expense' ? 'expenses' : 'incomes'}{' '}
                        found. Click "Add New" to create one.
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 space-y-6 pt-24">
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Income
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    ₹{totalIncomes.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Expenses
                                </CardTitle>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    ₹{totalExpenses.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Net Balance
                                </CardTitle>
                                <Wallet className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-2xl font-bold ${
                                        netBalance >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    ₹{netBalance.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mt-6"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="expense">
                                Expenses
                            </TabsTrigger>
                            <TabsTrigger value="income">
                                Incomes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BarChartIcon className="mr-2" />{' '}
                                        Monthly Financial Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {monthlyData.length > 0 ? (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={monthlyData}
                                            >
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey="income"
                                                    fill="#10b981"
                                                    name="Income"
                                                />
                                                <Bar
                                                    dataKey="expenses"
                                                    fill="#ef4444"
                                                    name="Expenses"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center py-10 text-muted-foreground">
                                            No transaction data
                                            available for
                                            visualization.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="expense">
                            {renderTable(expenses, 'expense')}
                        </TabsContent>

                        <TabsContent value="income">
                            {renderTable(incomes, 'income')}
                        </TabsContent>
                    </Tabs>

                    <FormDialog
                        open={isDialogOpen}
                        mode={dialogMode as 'add' | 'edit'}
                        activeTab={activeTab as 'expense' | 'income'}
                        formData={formData}
                        onClose={() => setIsDialogOpen(false)}
                        onInputChange={handleInputChange}
                        onCategoryChange={handleCategoryChange}
                        onSave={handleSave}
                        onCsvUpload={handleCsvUpload}
                        isSubmitting={isSubmitting}
                        categories={
                            activeTab === 'expense'
                                ? expenseCategories
                                : incomeCategories
                        }
                    />
                </>
            )}
        </div>
    );
};

export default FinanceDashboard;