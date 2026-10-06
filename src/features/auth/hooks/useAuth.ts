// src/features/auth/hooks/useAuth.ts

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginFormData } from "../schemas/auth.schema";
import { loginWithEmail, logoutUser } from "../services/auth.service";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		setUser,
		setSession,
		setStores,
		setActiveStore,
		logout: resetStore,
	} = useAuthStore();

	const login = async (data: LoginFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			const { session, user, stores } = await loginWithEmail(data);

			setSession(session);
			setUser(user);
			setStores(stores);

			// Asignar por defecto la tienda asignada en el perfil o la primera disponible
			const defaultStore =
				stores.find((s) => s.id === user.store_id) || stores[0] || null;
			setActiveStore(defaultStore);

			return true;
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Ocurrió un error inesperado al iniciar sesión.");
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		await logoutUser();
		resetStore();
	};

	return {
		login,
		logout,
		isLoading,
		error,
	};
};
