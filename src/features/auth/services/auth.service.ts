// src/features/auth/services/auth.service.ts

import { supabase } from "@/lib/supabase";
import type { Profile, Store } from "@/shared/types/database";
import type { LoginFormData } from "../schemas/auth.schema";

export const loginWithEmail = async ({ email, password }: LoginFormData) => {
	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email,
			password,
		});

	if (authError) {
		throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
	}

	if (!authData.user || !authData.session) {
		throw new Error("No se pudo iniciar la sesión.");
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", authData.user.id)
		.single();

	if (profileError || !profile) {
		throw new Error("No se encontró el perfil de usuario asignado.");
	}

	const { data: storesData, error: storesError } = await supabase
		.from("stores")
		.select("*");

	if (storesError) {
		throw new Error("Error al obtener la lista de tiendas.");
	}

	return {
		session: authData.session,
		user: profile as Profile,
		stores: (storesData || []) as Store[],
	};
};

export const logoutUser = async () => {
	await supabase.auth.signOut();
};
