'use client';
import React, { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    fetchTransactionsService,
    fetchUserService,
    fetchSubscriptionsService
} from './services';
import useSubscriptionStore from '@/store/useSubscriptionStore';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, setUser } = useUserStore();
    const {
        expenses,
        incomes,
        setExpenses,
        setIncomes,
        setLoading: setFinanceLoading,
    } = useFinanceStore();
    const {
        subscriptions,
        setSubscription,
        setLoading: setSubscriptionLoading,
    } = useSubscriptionStore();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setFinanceLoading(true);
            setSubscriptionLoading(true);

            try {
                if (!user || user == null) {
                    await fetchUserService({ setUser });
                    await fetchTransactionsService({
                        setExpenses,
                        setIncomes,
                    });
                    await fetchSubscriptionsService(setSubscription);
                } else {
                    if (!expenses || !incomes) {
                        await fetchTransactionsService({
                            setExpenses,
                            setIncomes,
                        });
                    }

                    if (
                        !subscriptions
                    ) {
                        await fetchSubscriptionsService(
                            setSubscription
                        );
                    }
                }

                toast.success('Data fetched successfully');
            } catch (error: any) {
                console.error(error);
                if (!user) router.push('/auth/login');
                toast.error(error?.message || 'Something went wrong');
            } finally {
                setFinanceLoading(false);
                setSubscriptionLoading(false);
            }
        };

        fetchData();
    }, [
        router,
        user,
        expenses,
        incomes,
        subscriptions,
        setFinanceLoading,
        setSubscriptionLoading,
    ]);

    return <div className="py-[10vh]">{children}</div>;
}