// src/features/auth/pages/LoginPage.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Lock, Mail, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/Input";
import { useAuth } from "../hooks/useAuth";
import { type LoginFormData, loginSchema } from "../schemas/auth.schema";

export const LoginPage = () => {
	const { login, isLoading, error } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		const success = await login(data);
		if (success) {
			navigate("/tiendas");
		}
	};

	return (
		<div className="min-h-screen w-full bg-[#0b0f17] flex items-center justify-center p-4">
			<div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

			<div className="w-full max-w-md bg-[#111827] border border-gray-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
				<div className="flex flex-col items-center text-center mb-8">
					<div className="w-14 h-14 bg-blue-600/15 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mb-3">
						<Store className="w-7 h-7" />
					</div>
					<h1 className="text-2xl font-bold text-gray-100 tracking-tight">
						POS Tiendas
					</h1>
					<p className="text-xs text-gray-400 mt-1">
						Control de Inventarios & Maquinitas
					</p>
				</div>

				{error && (
					<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
						<AlertCircle className="w-5 h-5 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<Input
						label="Correo Electrónico"
						type="email"
						placeholder="usuario@tienda.com"
						icon={<Mail className="w-4 h-4" />}
						error={errors.email?.message}
						{...register("email")}
					/>

					<Input
						label="Contraseña"
						type="password"
						placeholder="••••••••"
						icon={<Lock className="w-4 h-4" />}
						error={errors.password?.message}
						{...register("password")}
					/>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Ingresando...</span>
							</>
						) : (
							<span>Iniciar Sesión</span>
						)}
					</button>
				</form>

				<p className="text-center text-xs text-gray-500 mt-8">
					Acceso privado • Tuluá, Valle
				</p>
			</div>
		</div>
	);
};
