import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDateForInput = (date: Date) => {
    if (!date) return '';

    // If it's already a string in correct format, return it
    if (
        typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return date;
    }

    // Convert to Date object if it's a string date
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if it's a valid date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return '';
    }

    // Format to yyyy-MM-dd
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
