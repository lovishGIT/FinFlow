import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface FormDialogProps {
    open: boolean;
    mode: 'add' | 'edit';
    activeTab: 'expense' | 'income';
    formData: any;
    onClose: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCategoryChange: (value: string) => void;
    onSave: () => void;
    isSubmitting?: boolean;
    categories?: string[];
}

const FormDialog: React.FC<FormDialogProps> = ({
    open,
    mode,
    activeTab,
    formData,
    onClose,
    onInputChange,
    onCategoryChange,
    onSave,
    isSubmitting = false,
    categories = [],
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'Add New' : 'Edit'}{' '}
                        {activeTab === 'expense'
                            ? 'Expense'
                            : 'Income'}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onInputChange}
                            className="col-span-3"
                            required
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
                            onValueChange={onCategoryChange}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
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
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            className="col-span-3"
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            {activeTab === "expense" ? "Receiver's" : "Sender's"} Email
                        </Label>
                        <Input
                            id={activeTab === "expense" ? "receiverEmail" : "senderEmail"}
                            name={activeTab === "expense" ? "receiverEmail" : "senderEmail"}
                            type="email"
                            value={activeTab === "expense" ? formData.receiverEmail : formData.senderEmail}
                            onChange={onInputChange}
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
                            step="0.01"
                            value={formData.amount}
                            onChange={onInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={onInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
