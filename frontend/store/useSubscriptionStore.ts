import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Subscription } from '@/types';

export interface SubscriptionsState {
    subscriptions: Subscription[];
    isLoading: boolean;

    // Actions
    setSubscription: (subscriptions: Subscription[]) => void;
    updateSubscription: (
        id: string,
        updatedSubscription: Partial<Subscription>
    ) => void;
    toggleSubscription: (
        id: string,
        status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED'
    ) => void;
    deleteSubscription: (id: string) => void;

    setLoading: (loading: boolean) => void;
}

// Create the store with the persist middleware
const useSubscriptionStore = create<SubscriptionsState>()(
    persist(
        (set) => ({
            subscriptions: [],
            isLoading: false,

            // Actions
            setSubscription: (subscriptions) =>
                set({ subscriptions }),
            updateSubscription: (id, updatedSubscription) =>
                set((state) => ({
                    subscriptions: state.subscriptions.map((sub) =>
                        sub.id === id
                            ? { ...sub, ...updatedSubscription }
                            : sub
                    ),
                })),
            deleteSubscription: (id) =>
                set((state) => ({
                    subscriptions: state.subscriptions.filter(
                        (sub) => sub.id !== id
                    ),
                })),
            toggleSubscription: (id, status) =>
                set((state) => ({
                    subscriptions: state.subscriptions.map((sub) =>
                        sub.id === id ? { ...sub, status } : sub
                    ),
                })),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'subscription-storage',
        }
    )
);

export default useSubscriptionStore;
