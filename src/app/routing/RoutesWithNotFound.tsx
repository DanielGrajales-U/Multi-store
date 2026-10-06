import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

interface Props {
	children: ReactNode;
}

export function RoutesWithNotFound({ children }: Props) {
	return (
		<Routes>
			{children}
			<Route
				path="*"
				element={
					<div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center p-4 text-center">
						<h1 className="text-6xl font-bold text-blue-500">404</h1>
						<p className="text-xl text-gray-300 mt-2 font-medium">
							Página no encontrada
						</p>
						<p className="text-sm text-gray-500 mt-1">
							La ruta que buscas no existe en el sistema.
						</p>
						<a
							href="/"
							className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all"
						>
							Volver al Inicio
						</a>
					</div>
				}
			/>
		</Routes>
	);
}
