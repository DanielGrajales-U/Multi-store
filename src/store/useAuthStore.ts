import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Store } from "@/shared/types/database";

export interface AuthState {
	user: Profile | null;
	session: Session | null;
	stores: Store[];
	activeStore: Store | null;
	isAuthenticated: boolean;
}

const EmptyAuthState: AuthState = {
	user: null,
	session: null,
	stores: [],
	activeStore: null,
	isAuthenticated: false,
};

interface AuthActions {
	setUser: (user: Profile | null) => void;
	setSession: (session: Session | null) => void;
	setStores: (stores: Store[]) => void;
	setActiveStore: (store: Store | null) => void;
	logout: () => void;
	updateAuth: (partial: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set) => ({
			...EmptyAuthState,

			setUser: (user) =>
				set((state) => ({
					...state,
					user,
					isAuthenticated: !!user || !!state.session,
				})),

			setSession: (session) =>
				set((state) => ({
					...state,
					session,
					isAuthenticated: !!session,
				})),

			setStores: (stores) =>
				set((state) => ({
					...state,
					stores,
				})),

			setActiveStore: (activeStore) =>
				set((state) => ({
					...state,
					activeStore,
				})),

			logout: () => set(EmptyAuthState),

			updateAuth: (partial) =>
				set((state) => ({
					...state,
					...partial,
				})),
		}),
		{
			name: "pos_auth_state",
			partialize: (state) => ({
				user: state.user,
				session: state.session,
				stores: state.stores,
				activeStore: state.activeStore,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
