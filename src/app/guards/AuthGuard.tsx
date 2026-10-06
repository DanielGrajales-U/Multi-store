// src/app/guards/AuthGuard.tsx
import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { AUTH_ROUTES } from "../routing/routes";

export function AuthGuard() {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to={`${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.LOGIN}`} replace />;
	}

	return <Outlet />;
}
