import React, { useState } from 'react';
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Loader2, Upload, Edit, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateForInput } from '../../lib/cn.utils';

interface FormDialogProps {
    open: boolean;
    mode: 'add' | 'edit';
    activeTab: 'expense' | 'income';
    formData: any;
    onClose: () => void;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onCategoryChange: (value: string) => void;
    onSave: () => void;
    onCsvUpload?: (file: File) => void;
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
    onCsvUpload,
    isSubmitting = false,
    categories = [],
}) => {
    const [inputMethod, setInputMethod] = useState<string>('manual');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvUploadStatus, setCsvUploadStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [csvErrorMessage, setCsvErrorMessage] =
        useState<string>('');

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (
                file.type !== 'text/csv' &&
                !file.name.endsWith('.csv')
            ) {
                setCsvUploadStatus('error');
                setCsvErrorMessage('Please upload a valid CSV file');
                setCsvFile(null);
                return;
            }

            setCsvFile(file);
            setCsvUploadStatus('success');
            setCsvErrorMessage('');
        }
    };

    const handleSubmit = () => {
        if (inputMethod === 'manual') {
            onSave();
        } else if (inputMethod === 'csv' && csvFile) {
            // This would be implemented in the parent component
            if (onCsvUpload) {
                onCsvUpload(csvFile);
            }
            onClose();
        }
    };

    const dialogTitle = `${mode === 'add' ? 'Add New' : 'Edit'} ${
        activeTab === 'expense' ? 'Expense' : 'Income'
    }`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

<Tabs
                    value={inputMethod}
                    onValueChange={setInputMethod}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="manual"
                            className="flex items-center"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Manual Entry
                        </TabsTrigger>
                        <TabsTrigger
                            value="csv"
                            className="flex items-center"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            CSV Upload
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
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
                                        {categories.map(
                                            (category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            )
                                        )}
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
                                    value={formatDateForInput(formData.date)}
                                    onChange={onInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="csv">
                        <div className="flex flex-col gap-4 py-4">
                            <div className="text-sm text-muted-foreground mb-2">
                                Upload a CSV file to bulk add{' '}
                                {activeTab === 'expense'
                                    ? 'expenses'
                                    : 'incomes'}
                                . The CSV should contain columns for
                                title, category, description, amount,
                                and date.
</div>

                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-4">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                                <div className="flex flex-col items-center gap-2">
                                    <Label
                                        htmlFor="csv-upload"
                                        className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
                                    >
                                        Choose CSV File
                                    </Label>
                                    <Input
                                        id="csv-upload"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {csvFile
                                            ? csvFile.name
                                            : 'No file selected'}
                                    </span>
                                </div>
                            </div>

                            {csvUploadStatus === 'success' && (
                                <Alert className="bg-green-50 border-green-200">
                                    <AlertDescription className="text-green-600">
                                        CSV file selected
                                        successfully: {csvFile?.name}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {csvUploadStatus === 'error' && (
                                <Alert className="bg-red-50 border-red-200">
                                    <AlertDescription className="text-red-600">
                                        {csvErrorMessage}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="mt-2 border p-4 rounded-md">
                                <h4 className="text-sm font-medium mb-2">
                                    Expected CSV Format:
                                </h4>
                                <div className="text-xs text-muted-foreground font-mono bg-gray-50 p-2 rounded">
                                    title,category,description,amount,date
                                    <br />
                                    Groceries,Shopping,Weekly
                                    groceries,125.50,2025-05-18
                                    <br />
                                    ...
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            isSubmitting ||
                            (inputMethod === 'csv' && !csvFile)
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : inputMethod === 'manual' ? (
                            'Save'
                        ) : (
                            'Upload & Save'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
