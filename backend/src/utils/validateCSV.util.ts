import { ExpenseCSVRow, IncomeCSVRow } from "@/../types/index.js";

export const validateIncomeRow = (row: IncomeCSVRow): boolean => {
    if (!row.amount || isNaN(Number(row.amount))) {
        return false;
    }

    // Date Check [Date is Optional]
    if (row.date && isNaN(Date.parse(row.date))) {
        return false;
    }

    return true;
};


export const validateExpenseRow = (row: ExpenseCSVRow): boolean => {
    if (!row.amount || isNaN(Number(row.amount))) {
        return false;
    }

    // Date Check [Date is Optional]
    if (row.date && isNaN(Date.parse(row.date))) {
        return false;
    }

    return true;
};