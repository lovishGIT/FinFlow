import { Expense, Income } from "@/types/index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FormDialogProps {
    open: boolean;
    mode: 'add' | 'edit';
    activeTab: 'expense' | 'income';
    formData: Partial<Expense | Income>;
    onClose: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryChange: (value: string) => void;
    onSave: () => void;
}

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

const FormDialog: React.FC<FormDialogProps> = ({
    open,
    mode,
    activeTab,
    formData,
    onClose,
    onInputChange,
    onCategoryChange,
    onSave,
}) => {
    const categories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add'
                            ? `Add New ${activeTab === 'expense' ? 'Expense' : 'Income'}`
                            : `Edit ${activeTab === 'expense' ? 'Expense' : 'Income'}`}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4"> {/* Title */}
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4"> {/* Category */}
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
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category: string) => (
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
                    <div className="grid grid-cols-4 items-center gap-4"> {/* Description */}
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
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4"> {/* Amount */}
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
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4"> {/* Date */}
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date as string}
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 p-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;