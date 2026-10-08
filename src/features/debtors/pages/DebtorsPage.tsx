// src/features/debtors/pages/DebtorsPage.tsx

import { Plus, Search, UserCheck } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CreateDebtModal } from "../components/CreateDebtModal";
import { CreateDebtorModal } from "../components/CreateDebtorModal";
import { DebtorCard } from "../components/DebtorCard";
import { DebtorDetailModal } from "../components/DebtorDetailModal";
import { useDebtors } from "../hooks/useDebtors";
import { useDebtorsMutations } from "../hooks/useDebtorsMutations";
import type { Debtor } from "../types/debtors.types";

const DebtorsPage = () => {
	const activeStore = useAuthStore((state) => state.activeStore);
	const user = useAuthStore((state) => state.user);
	const session = useAuthStore((state) => state.session);

	const currentStoreId = activeStore?.id;
	const currentUserId = user?.id || session?.user?.id;

	const { debtors, isLoading, searchQuery, setSearchQuery, refetch } =
		useDebtors(currentStoreId);

	const { isSubmitting } = useDebtorsMutations(
		currentStoreId,
		currentUserId,
		refetch,
	);

	const [isCreateDebtorOpen, setIsCreateDebtorOpen] = useState(false);
	const [selectedDebtorForNewDebt, setSelectedDebtorForNewDebt] =
		useState<Debtor | null>(null);
	const [selectedDebtorForDetail, setSelectedDebtorForDetail] =
		useState<Debtor | null>(null);

	// Guard simple por si la tienda activa no se ha terminado de resolver
	if (!currentStoreId || !currentUserId) {
		return (
			<div className="p-6 text-center text-xs text-gray-500">
				Cargando información de la tienda...
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
						<UserCheck className="w-6 h-6 text-blue-500" />
						Fiados y Cuentas por Cobrar
					</h1>
					<p className="text-xs text-gray-400 mt-1">
						Gestiona los clientes con saldo pendiente y sus abonos.
					</p>
				</div>

				<button
					type="button"
					onClick={() => setIsCreateDebtorOpen(true)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
				>
					<Plus className="w-4 h-4" />
					<span>Nuevo Deudor</span>
				</button>
			</div>

			{/* Buscador */}
			<div className="relative max-w-md">
				<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Buscar por cliente o teléfono..."
					className="w-full pl-9 pr-4 py-2 bg-[#182232] border border-gray-800 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500 transition-all"
				/>
			</div>

			{/* Grid de Deudores */}
			{isLoading ? (
				<div className="text-center py-12 text-xs text-gray-500">
					Cargando clientes deudores...
				</div>
			) : debtors.length === 0 ? (
				<div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
					<p className="text-xs text-gray-500">
						No se encontraron deudores registrados.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{debtors.map((debtor) => (
						<DebtorCard
							key={debtor.id}
							debtor={debtor}
							onSelect={(d) => setSelectedDebtorForDetail(d)}
							onAddDebt={(d) => setSelectedDebtorForNewDebt(d)}
						/>
					))}
				</div>
			)}

			{/* Modales */}
			{isCreateDebtorOpen && (
				<CreateDebtorModal
					isOpen={isCreateDebtorOpen}
					onClose={() => setIsCreateDebtorOpen(false)}
					onSuccess={refetch}
					storeId={currentStoreId}
					userId={currentUserId}
				/>
			)}

			{selectedDebtorForNewDebt && (
				<CreateDebtModal
					isOpen={!!selectedDebtorForNewDebt}
					debtor={selectedDebtorForNewDebt}
					onClose={() => setSelectedDebtorForNewDebt(null)}
					onSuccess={refetch}
					storeId={currentStoreId}
					userId={currentUserId}
				/>
			)}

			{selectedDebtorForDetail && (
				<DebtorDetailModal
					isOpen={!!selectedDebtorForDetail}
					debtor={selectedDebtorForDetail}
					onClose={() => setSelectedDebtorForDetail(null)}
					onRefresh={refetch}
					storeId={currentStoreId}
					userId={currentUserId}
				/>
			)}
		</div>
	);
};

export default DebtorsPage;
