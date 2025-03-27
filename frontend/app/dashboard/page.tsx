'use client';
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { Expense, Income } from '@/types/index';

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
    const [expenses, setExpenses] = useState<Expense[]>([
        {
            id: '1',
            title: 'Weekly Groceries',
            category: 'Groceries',
            description: 'Supermarket shopping',
            amount: 125.5,
            date: new Date('2024-03-15'),
        },
        {
            id: '2',
            title: 'Restaurant Dinner',
            category: 'Dining Out',
            description: 'Dinner with friends',
            amount: 85.75,
            date: new Date('2024-03-20'),
        },
    ]);

    const [incomes, setIncomes] = useState<Income[]>([
        {
            id: '1',
            title: 'Monthly Salary',
            category: 'Salary',
            description: 'Primary job income',
            amount: 5000.0,
            date: new Date('2024-03-01'),
        },
        {
            id: '2',
            title: 'Freelance Project',
            category: 'Freelance',
            description: 'Web development work',
            amount: 750.5,
            date: new Date('2024-03-15'),
        },
    ]);

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedItem, setSelectedItem] = useState<ItemWithType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogMode, setDialogMode] = useState<string>('add');
    const [formData, setFormData] = useState<
        Partial<Expense | Income>
    >({
        title: '',
        category: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
    });

    // Calculate financial metrics
    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );
    const totalIncomes = incomes.reduce(
        (sum, income) => sum + income.amount,
        0
    );
    const netBalance = totalIncomes - totalExpenses;

    // Prepare data for charts
    const monthlyData = [
        { month: 'Jan', expenses: 1200, income: 5500 },
        { month: 'Feb', expenses: 1100, income: 5600 },
        { month: 'Mar', expenses: 1300, income: 5750 },
    ];

    // Open dialog for adding new item
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
        setIsDialogOpen(true);
    };

    // Open dialog for editing existing item
    const handleEdit = (item: Expense | Income, type: string) => {
        setDialogMode('edit');
        setFormData({
            title: item.title,
            category: item.category,
            description: item.description,
            amount: item.amount,
            date: new Date(item.date).toISOString().split('T')[0],
        });
        setSelectedItem({ ...item, type });
        setIsDialogOpen(true);
    };

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle category change
    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    // Save new or edited item
    const handleSave = () => {
        const newItem = {
            id: selectedItem
                ? selectedItem.id
                : Date.now().toString(),
            title: formData.title,
            category: formData.category,
            description: formData.description,
            amount: formData.amount,
            date: new Date(formData.date as string),
        };

        if (dialogMode === 'add') {
            if (selectedItem?.type === 'expense') {
                setExpenses((prev) => [...prev, newItem as Expense]);
            } else {
                setIncomes((prev) => [...prev, newItem as Income]);
            }
        } else {
            if (selectedItem?.type === 'expense') {
                setExpenses((prev) =>
                    prev.map((item) =>
                        selectedItem && item.id === selectedItem.id
                            ? (newItem as Expense)
                            : item
                    )
                );
            } else {
                setIncomes((prev) =>
                    prev.map((item) =>
                        selectedItem && item.id === selectedItem.id
                            ? (newItem as Income)
                            : item
                    )
                );
            }
        }

        setIsDialogOpen(false);
    };

    // Remove an item
    const handleRemove = (id: string, type: string) => {
        if (type === 'expense') {
            setExpenses((prev) =>
                prev.filter((item) => item.id !== id)
            );
        } else {
            setIncomes((prev) =>
                prev.filter((item) => item.id !== id)
            );
        }
    };

    const renderTable = (
        items: Expense[] | Income[],
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
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.category}</TableCell>
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
                                    {type === 'expense' ? '-' : '+'}$
                                    {item.amount.toFixed(2)}
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
                                                handleEdit(item, type)
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
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 space-y-6 pt-24">
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
                            ${totalIncomes.toFixed(2)}
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
                            ${totalExpenses.toFixed(2)}
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
                            ${netBalance.toFixed(2)}
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
                    <TabsTrigger value="expenses">
                        Expenses
                    </TabsTrigger>
                    <TabsTrigger value="incomes">Incomes</TabsTrigger>
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
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <BarChart data={monthlyData}>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses">
                    {renderTable(expenses, 'expense')}
                </TabsContent>

                <TabsContent value="incomes">
                    {renderTable(incomes, 'income')}
                </TabsContent>
            </Tabs>

            <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === 'add'
                                ? `Add New ${
                                    selectedItem?.type === 'expense'
                                        ? 'Expense'
                                        : 'Income'
                                }`
                                : `Edit ${
                                    selectedItem?.type === 'expense'
                                        ? 'Expense'
                                        : 'Income'
                                }`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="title"
                                className="text-right"
                            >
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="category"
                                className="text-right"
                            >
                                Category
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(selectedItem?.type === 'expense'
                                        ? expenseCategories
                                        : incomeCategories
                                    ).map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="description"
                                className="text-right"
                            >
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="amount"
                                className="text-right"
                            >
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="date"
                                className="text-right"
                            >
                                Date
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date as string}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 p-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FinanceDashboard;