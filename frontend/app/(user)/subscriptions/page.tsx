'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Subscription } from '@/types';

const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

    const handleSave = (subscription: Subscription) => {
        if (editingSubscription) {
            // Edit existing subscription
            setSubscriptions((prev) =>
                prev.map((sub) => (sub.id === subscription.id ? subscription : sub))
            );
        } else {
            // Add new subscription
            setSubscriptions((prev) => [...prev, { ...subscription, id: Date.now().toString() }]);
        }
        setIsDialogOpen(false);
        setEditingSubscription(null);
    };

    const handleEdit = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingSubscription(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
            <Button onClick={handleAdd} className="mb-4">
                Add Subscription
            </Button>
            <div className="space-y-4">
                {subscriptions.map((subscription) => (
                    <div
                        key={subscription.id}
                        className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{subscription.name}</h2>
                            <p className="text-sm text-gray-600">Category: {subscription.category || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Start Date: {subscription.startDate}</p>
                            <p className="text-sm text-gray-600">End Date: {subscription.endDate || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Status: {subscription.status}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold">${subscription.amount.toFixed(2)}</p>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(subscription)}>
                                Edit
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSubscription ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
                    </DialogHeader>
                    <SubscriptionForm
                        subscription={editingSubscription}
                        onSave={handleSave}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

interface SubscriptionFormProps {
    subscription?: Subscription | null;
    onSave: (subscription: Subscription) => void;
    onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ subscription, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Subscription>(
        subscription || {
            id: '',
            name: '',
            category: '',
            amount: 0,
            description: '',
            status: 'ACTIVE',
            startDate: '',
            endDate: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: Subscription['status']) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Subscription Name"
                />
            </div>
            <div>
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    placeholder="Category"
                />
            </div>
            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                />
            </div>
            <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                        <span>{formData.status}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button onClick={handleSubmit}>Save</Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </DialogFooter>
        </div>
    );
};

export default SubscriptionsPage;