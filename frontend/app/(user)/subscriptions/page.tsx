'use client';

import React, { useMemo, useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    AlertCircle,
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import {
    addSubscriptionService,
    updateSubscriptionService,
    toggleSubscriptionService,
    deleteSubscriptionService,
} from '../services';
import type { Subscription } from '@/types';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function SubscriptionsPage() {
    const {
        subscriptions,
        isLoading,
        setSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscription,
    } = useSubscriptionStore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [tab, setTab] = useState('active');

    const [currentSubscription, setCurrentSubscription] =
        useState<Subscription | null>(null);
    const [formData, setFormData] = useState<Partial<Subscription>>({
        name: '',
        description: '',
        amount: 0,
        status: 'ACTIVE',
        category: 'Entertainment',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Subscription;
        direction: 'asc' | 'desc';
    }>({
        key: 'name',
        direction: 'asc',
    });

    // Calculate total monthly cost
    const monthlyTotal = useMemo(() => {
        return subscriptions.reduce((total, sub) => {
            if (sub.status !== 'ACTIVE') return total;
            const amount =
                typeof sub.amount === 'string'
                    ? Number.parseFloat(sub.amount)
                    : sub.amount;
            return total + amount;
        }, 0);
    }, [subscriptions]);

    // Filter subscriptions by status
    const activeSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'ACTIVE'
    );
    const inactiveSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'INACTIVE'
    );
    const cancelledSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'CANCELLED'
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'amount' ? Number.parseFloat(value) : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            amount: 0,
            status: 'ACTIVE',
            category: 'Entertainment',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
        setCurrentSubscription(null);
    };

    const handleAddSubscription = async () => {
        try {
            await addSubscriptionService(
                formData,
                (newSubscription) => {
                    setSubscription([
                        ...subscriptions,
                        newSubscription,
                    ]);
                }
            );
            toast.success('Subscription added successfully');
            setIsAddDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(
                error.message || 'Failed to add subscription'
            );
        }
    };

    const handleEditSubscription = async () => {
        if (!currentSubscription) return;

        try {
            await updateSubscriptionService(
                currentSubscription.id,
                formData,
                updateSubscription
            );
            toast.success('Subscription updated successfully');
            setIsEditDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(
                error.message || 'Failed to update subscription'
            );
        }
    };

    const handleDeleteSubscription = async (id: string) => {
        try {
            await deleteSubscriptionService(id, deleteSubscription);
            toast.success('Subscription deleted successfully');
        } catch (error: any) {
            toast.error(
                error.message || 'Failed to delete subscription'
            );
        }
    };

    const handleToggleSubscription = async (id: string) => {
        try {
            await toggleSubscriptionService(id, toggleSubscription);
            toast.success('Subscription status updated');
        } catch (error: any) {
            toast.error(
                error.message ||
                    'Failed to update subscription status'
            );
        }
    };

    const openEditDialog = (subscription: Subscription) => {
        setCurrentSubscription(subscription);
        setFormData({
            name: subscription.name,
            description: subscription.description,
            amount: subscription.amount,
            status: subscription.status,
            category: subscription.category || '',
            startDate: new Date(subscription.startDate)
                .toISOString()
                .split('T')[0],
            endDate: subscription.endDate
                ? new Date(subscription.endDate)
                    .toISOString()
                    .split('T')[0]
                : '',
        });
        setIsEditDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-green-500">Active</Badge>;
            case 'INACTIVE':
                return (
                    <Badge className="bg-yellow-500">Inactive</Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge className="bg-red-500">Cancelled</Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return '₹' + amount;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getCategoryText = (category?: string) => {
        if (!category) return 'Uncategorized';
        return (
            category.charAt(0).toUpperCase() +
            category.slice(1).toLowerCase()
        );
    };

    const handleSort = (key: keyof Subscription) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key &&
                sortConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        });
    };

    const renderSortIcon = (key: keyof Subscription) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
        );
    };

    const renderSubscriptionTable = (displayData: Subscription[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            onClick={() => handleSort('name')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Name
                                {renderSortIcon('name')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('description')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Description
                                {renderSortIcon('description')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('amount')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Amount
                                {renderSortIcon('amount')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('category')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Category
                                {renderSortIcon('category')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('startDate')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Start Date
                                {renderSortIcon('startDate')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('endDate')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                End Date
                                {renderSortIcon('endDate')}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort('status')}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center">
                                Status
                                {renderSortIcon('status')}
                            </div>
                        </TableHead>
                        <TableHead className="w-24">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayData.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="h-24 text-center"
                            >
                                No subscriptions found
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayData.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell className="font-medium">
                                    {subscription.name}
                                </TableCell>
                                <TableCell>
                                    {subscription.description}
                                </TableCell>
                                <TableCell>
                                    {formatCurrency(
                                        subscription.amount
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getCategoryText(
                                        subscription.category
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatDate(
                                        subscription.startDate
                                    )}
                                </TableCell>
                                <TableCell>
                                    {subscription.endDate
                                        ? formatDate(
                                            subscription.endDate
                                        )
                                        : 'No end date'}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(
                                        subscription.status
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                openEditDialog(
                                                    subscription
                                                )
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleToggleSubscription(
                                                    subscription.id
                                                )
                                            }
                                        >
                                            {subscription.status ===
                                            'ACTIVE' ? (
                                                <X className="h-4 w-4" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {subscription.status ===
                                                'ACTIVE'
                                                    ? 'Deactivate'
                                                    : 'Activate'}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-600"
                                            onClick={() =>
                                                handleDeleteSubscription(
                                                    subscription.id
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete
                                            </span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Subscriptions
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your recurring subscriptions and
                        services
                    </p>
                </div>
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subscription
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Add New Subscription
                            </DialogTitle>
                            <DialogDescription>
                                Enter the details of your subscription
                                below
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Netflix, Spotify, etc."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Streaming service for movies and TV shows"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="9.99"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Entertainment, Utilities, etc."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">
                                        End Date (Optional)
                                    </Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        handleSelectChange(
                                            'status',
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="INACTIVE">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setIsAddDialogOpen(false)
                                }
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddSubscription}>
                                Add Subscription
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Edit Subscription
                            </DialogTitle>
                            <DialogDescription>
                                Update the details of your
                                subscription
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">
                                    Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Input
                                    id="edit-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-amount">
                                    Amount
                                </Label>
                                <Input
                                    id="edit-amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">
                                    Category
                                </Label>
                                <Input
                                    id="edit-category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Entertainment, Utilities, etc."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-startDate">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="edit-startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-endDate">
                                        End Date (Optional)
                                    </Label>
                                    <Input
                                        id="edit-endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">
                                    Status
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        handleSelectChange(
                                            'status',
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="INACTIVE">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setIsEditDialogOpen(false)
                                }
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleEditSubscription}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Card */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <h3 className="text-lg font-medium mb-1">
                                Total Monthly Cost
                            </h3>
                            <p className="text-3xl font-bold">
                                {formatCurrency(monthlyTotal)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <h3 className="text-lg font-medium mb-1">
                                Active Subscriptions
                            </h3>
                            <p className="text-3xl font-bold">
                                {activeSubscriptions.length}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <h3 className="text-lg font-medium mb-1">
                                Total Subscriptions
                            </h3>
                            <p className="text-3xl font-bold">
                                {subscriptions.length}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : subscriptions.length === 0 ? (
                <Alert className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No subscriptions found</AlertTitle>
                    <AlertDescription>
                        You don't have any subscriptions yet. Click
                        the "Add Subscription" button to get started.
                    </AlertDescription>
                </Alert>
            ) : (
                <Tabs
                    className="w-full"
                    value={tab}
                    onValueChange={setTab}
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="all">
                            All ({subscriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Active ({activeSubscriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="inactive">
                            Inactive ({inactiveSubscriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="cancelled">
                            Cancelled ({cancelledSubscriptions.length}
                            )
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        {renderSubscriptionTable(subscriptions)}
                    </TabsContent>

                    <TabsContent value="active" className="mt-0">
                        {activeSubscriptions.length === 0 ? (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>
                                    No active subscriptions
                                </AlertTitle>
                                <AlertDescription>
                                    You don't have any active
                                    subscriptions.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            renderSubscriptionTable(activeSubscriptions)
                        )}
                    </TabsContent>

                    <TabsContent value="inactive" className="mt-0">
                        {inactiveSubscriptions.length === 0 ? (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>
                                    No inactive subscriptions
                                </AlertTitle>
                                <AlertDescription>
                                    You don't have any inactive
                                    subscriptions.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            renderSubscriptionTable(inactiveSubscriptions)
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-0">
                        {cancelledSubscriptions.length === 0 ? (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>
                                    No cancelled subscriptions
                                </AlertTitle>
                                <AlertDescription>
                                    You don't have any cancelled
                                    subscriptions.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            renderSubscriptionTable(cancelledSubscriptions)
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};