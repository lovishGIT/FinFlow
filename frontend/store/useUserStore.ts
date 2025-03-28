import { User } from '@/types/index';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    user: User | null,
    setUser: (user: User | null) => void,
    resetUser: () => void,
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User | null) => set({ user }),
            resetUser: () => set({ user: null })
        }), {
            name: "user-storage"
        }
    )
);