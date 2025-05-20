'use client';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useFinanceStore } from '@/store/useFinanceStore';
import { generateReport, formatCurrency } from '@/app/(user)/utils';
import {
    PieChart,
    LineChart,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Pie,
    Cell,
    Line,
    Bar,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Report } from '@/types';

const LIGHT_COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82ca9d',
    '#ffc658',
];
const DARK_COLORS = [
    '#00BFFF',
    '#00FF7F',
    '#FFD700',
    '#FF4500',
    '#9370DB',
    '#3CB371',
    '#FFA07A',
];

export default function ReportsPage() {
    const { theme } = useTheme();
    const { expenses, incomes, isLoading } = useFinanceStore();
    const [timeframe, setTimeframe] = useState<
        'week' | 'month' | 'year'
    >('month');
    const [report, setReport] = useState<Report | null>(null);
    const [topIncomeCategories, setTopIncomeCategories] = useState<
        Array<{
            category: string;
            amount: number;
            percentage: number;
        }>
    >([]);

    const COLORS = useMemo(
        () => (theme === 'dark' ? DARK_COLORS : LIGHT_COLORS),
        [theme]
    );

    const chartColors = useMemo(
        () => ({
            income: theme === 'dark' ? '#4ade80' : '#22c55e', // Green
            expenses: theme === 'dark' ? '#f87171' : '#ef4444', // Red
            savings: theme === 'dark' ? '#a78bfa' : '#8b5cf6', // Purple
            gridLines:
                theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
            tooltipBg: theme === 'dark' ? '#374151' : '#ffffff',
            tooltipText: theme === 'dark' ? '#ffffff' : '#000000',
        }),
        [theme]
    );

    useEffect(() => {
        if (
            expenses.length === 0 &&
            incomes.length === 0 &&
            isLoading
        )
            return;

        const generatedReport = generateReport(
            expenses,
            incomes,
            timeframe
        );
        setReport(generatedReport);

        // Calculate top income categories (similar to expense categories in the util)
        const incomesByCategory: Record<string, number> = {};
        incomes.forEach((income) => {
            incomesByCategory[income.category] =
                (incomesByCategory[income.category] || 0) +
                income.amount;
        });

        const topIncomeCats = Object.entries(incomesByCategory)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage:
                    generatedReport.totalIncome > 0
                        ? (amount / generatedReport.totalIncome) * 100
                        : 0,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        setTopIncomeCategories(topIncomeCats);
    }, [expenses, incomes, timeframe, isLoading]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-4 rounded shadow-lg">
                    <p className="font-medium">{label}</p>
                    <div className="mt-1">
                        {payload.map((entry: any, index: number) => (
                            <p
                                key={`tooltip-item-${index}`}
                                style={{ color: entry.color }}
                            >
                                {entry.name}: ₹
                                {entry.value.toFixed(2)}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const downloadReport = () => {
        if (!report) return;

        const headers = 'Month,Income,Expenses,Savings\n';
        const csvContent = report.monthlyData
            .map(
                (month) =>
                    `${month.month},${month.income},${month.expenses},${month.savings}`
            )
            .join('\n');

        const blob = new Blob([headers + csvContent], {
            type: 'text/csv',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-report-${format(
            new Date(),
            'yyyy-MM-dd'
        )}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-foreground">
                    Loading your financial data...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                    Financial Reports
                </h1>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Select
                        value={timeframe}
                        onValueChange={(value) =>
                            setTimeframe(
                                value as 'week' | 'month' | 'year'
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">
                                Last Week
                            </SelectItem>
                            <SelectItem value="month">
                                Last Month
                            </SelectItem>
                            <SelectItem value="year">
                                Last Year
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={downloadReport}
                        className="flex items-center gap-2"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">
                            Download Report
                        </span>
                    </Button>
                </div>
            </div>

            {report && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Total Income
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-500 dark:text-green-400">
                                    {formatCurrency(
                                        report.totalIncome
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Total Expenses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-500 dark:text-red-400">
                                    {formatCurrency(
                                        report.totalExpenses
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Net Savings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p
                                    className={`text-3xl font-bold ${
                                        report.netSavings >= 0
                                            ? 'text-green-500 dark:text-green-400'
                                            : 'text-red-500 dark:text-red-400'
                                    }`}
                                >
                                    {formatCurrency(
                                        report.netSavings
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="overview">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="trends">
                                Trends
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Monthly Income vs Expenses
                                        </CardTitle>
                                        <CardDescription>
                                            Compare your income and
                                            expenses over time
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <LineChart
                                                    data={report.monthlyData.slice(
                                                        -6
                                                    )}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke={
                                                            chartColors.gridLines
                                                        }
                                                    />
                                                    <XAxis
                                                        dataKey="month"
                                                        stroke="currentColor"
                                                    />
                                                    <YAxis stroke="currentColor" />
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="income"
                                                        stroke={
                                                            chartColors.income
                                                        }
                                                        name="Income"
                                                        strokeWidth={
                                                            2
                                                        }
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="expenses"
                                                        stroke={
                                                            chartColors.expenses
                                                        }
                                                        name="Expenses"
                                                        strokeWidth={
                                                            2
                                                        }
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Expense Breakdown
                                        </CardTitle>
                                        <CardDescription>
                                            Your top spending
                                            categories
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-center">
                                        <div className="h-80 w-full flex justify-center">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            report.topExpenseCategories
                                                        }
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={
                                                            false
                                                        }
                                                        label={({
                                                            category,
                                                            percentage,
                                                        }) =>
                                                            `${category}: ${percentage.toFixed(
                                                                0
                                                            )}%`
                                                        }
                                                        outerRadius={
                                                            100
                                                        }
                                                        fill="#8884d8"
                                                        dataKey="amount"
                                                        nameKey="category"
                                                    >
                                                        {report.topExpenseCategories.map(
                                                            (
                                                                entry,
                                                                index
                                                            ) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(
                                                            value
                                                        ) =>
                                                            `₹${Number(
                                                                value
                                                            ).toFixed(
                                                                2
                                                            )}`
                                                        }
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="trends">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Savings Trend
                                        </CardTitle>
                                        <CardDescription>
                                            Your monthly savings over
                                            time
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <LineChart
                                                    data={
                                                        report.monthlyData
                                                    }
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke={
                                                            chartColors.gridLines
                                                        }
                                                    />
                                                    <XAxis
                                                        dataKey="month"
                                                        stroke="currentColor"
                                                    />
                                                    <YAxis stroke="currentColor" />
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="savings"
                                                        stroke={
                                                            chartColors.savings
                                                        }
                                                        name="Savings"
                                                        strokeWidth={
                                                            2
                                                        }
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Income Sources
                                        </CardTitle>
                                        <CardDescription>
                                            Your top income categories
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={
                                                        topIncomeCategories
                                                    }
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke={
                                                            chartColors.gridLines
                                                        }
                                                    />
                                                    <XAxis
                                                        dataKey="category"
                                                        stroke="currentColor"
                                                    />
                                                    <YAxis stroke="currentColor" />
                                                    <Tooltip
                                                        formatter={(
                                                            value
                                                        ) =>
                                                            `₹${Number(
                                                                value
                                                            ).toFixed(
                                                                2
                                                            )}`
                                                        }
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="amount"
                                                        name="Amount"
                                                    >
                                                        {topIncomeCategories.map(
                                                            (
                                                                entry,
                                                                index
                                                            ) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>
                                            Daily Spending
                                        </CardTitle>
                                        <CardDescription>
                                            Your daily income and
                                            expense patterns for the
                                            current month
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={
                                                        report.dailyData
                                                    }
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke={
                                                            chartColors.gridLines
                                                        }
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="currentColor"
                                                    />
                                                    <YAxis stroke="currentColor" />
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="income"
                                                        name="Income"
                                                        fill={
                                                            chartColors.income
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="expenses"
                                                        name="Expenses"
                                                        fill={
                                                            chartColors.expenses
                                                        }
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}