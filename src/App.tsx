import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { RoutesWithNotFound } from "@/app/routing/RoutesWithNotFound";
import { AUTH_ROUTES, POS_ROUTES } from "@/app/routing/routes";
import { ArcadePage } from "@/features/arcade/pages/ArcadePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { StoreSelectorPage } from "@/features/stores/pages/StoreSelectorPage";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";

function App() {
	const { isAuthenticated } = useAuthStore();

	return (
		<BrowserRouter>
			<RoutesWithNotFound>
				{/* Ruta de Auth */}
				<Route
					path={`${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.LOGIN}`}
					element={
						isAuthenticated ? (
							<Navigate to={`/${POS_ROUTES.SELECT_STORE}`} replace />
						) : (
							<LoginPage />
						)
					}
				/>
				<Route
					path={POS_ROUTES.ROOT}
					element={
						<Navigate
							to={
								isAuthenticated
									? `/${POS_ROUTES.SELECT_STORE}`
									: `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.LOGIN}`
							}
							replace
						/>
					}
				/>

				{/* Rutas Protegidas */}
				<Route element={<AuthGuard />}>
					{/* Vista de Selección de Tienda */}
					<Route
						path={POS_ROUTES.SELECT_STORE}
						element={<StoreSelectorPage />}
					/>

					{/* Rutas de Dashboard de Tienda con MainLayout */}
					<Route
						path="tienda/:storeId/*"
						element={
							<MainLayout>
								<Routes>
									<Route path={POS_ROUTES.ARCADE} element={<ArcadePage />} />
									<Route
										path={POS_ROUTES.INVENTORY}
										element={<div>Módulo de Inventario</div>}
									/>
									<Route
										path={POS_ROUTES.SALES}
										element={<div>Módulo de Caja</div>}
									/>
									<Route
										path={POS_ROUTES.DEBTS}
										element={<div>Módulo de Fiados</div>}
									/>
									<Route
										path="*"
										element={<Navigate to={POS_ROUTES.ARCADE} replace />}
									/>
								</Routes>
							</MainLayout>
						}
					/>
				</Route>
			</RoutesWithNotFound>
		</BrowserRouter>
	);
}

export default App;
