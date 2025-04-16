'use client';
import React, { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchTransactionsService, fetchUserService } from './services';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, setUser } = useUserStore();
    const { expenses, incomes, setExpenses, setIncomes, setLoading } = useFinanceStore();
    const router = useRouter();

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                if (!user || user == null) {
                    await fetchUserService({ setUser });
                    await fetchTransactionsService({ setExpenses, setIncomes });
                }
                else if (!expenses || !incomes) {
                    await fetchTransactionsService({ setExpenses, setIncomes });
                }

                toast.success('Data fetched successfully');
            } catch (error: any) {
                console.error(error);
                if(!user) router.push('/auth/login');
                toast.error(error?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, user, expenses, incomes, setLoading]);

    return <div className='py-[10vh]'>{children}</div>;
}