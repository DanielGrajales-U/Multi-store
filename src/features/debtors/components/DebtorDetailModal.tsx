import {
	ArrowDownCircle,
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	Receipt,
} from "lucide-react";
import { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { formatCOP } from "@/utils/format";
import { useDebtorDetails } from "../hooks/useDebtorsDetails.ts";
import type { Debt, Debtor } from "../types/debtors.types";
import { DebtorStatusBadge } from "./DebtorsStatusBadge.tsx";
import { PayDebtModal } from "./PayDebtModal";

interface Props {
	isOpen: boolean;
	debtor: Debtor;
	onClose: () => void;
	onRefresh: () => void;
	storeId: string;
	userId: string;
}

export const DebtorDetailModal = ({
	isOpen,
	debtor,
	onClose,
	onRefresh,
	storeId,
	userId,
}: Props) => {
	const [activeTab, setActiveTab] = useState<"debts" | "payments">("debts");
	const [selectedDebtForPayment, setSelectedDebtForPayment] =
		useState<Debt | null>(null);

	const {
		debts,
		payments,
		totalOriginal,
		totalPaid,
		isLoading,
		refetchDetails,
	} = useDebtorDetails(debtor.id, isOpen);

	const handlePaymentSuccess = () => {
		refetchDetails();
		onRefresh();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Estado de Cuenta • ${debtor.full_name}`}
			description="Detalle completo de consumos fiados y abonos registrados"
		>
			<div className="space-y-5">
				{/* Resumen Financiero Superior */}
				<div className="grid grid-cols-3 gap-2 bg-[#182232] border border-gray-800 rounded-2xl p-3 text-center">
					<div>
						<span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
							Total Histórico
						</span>
						<span className="font-mono text-sm font-semibold text-gray-200">
							${formatCOP(totalOriginal)}
						</span>
					</div>
					<div className="border-x border-gray-800">
						<span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-0.5">
							Abonado
						</span>
						<span className="font-mono text-sm font-semibold text-emerald-400">
							${formatCOP(totalPaid)}
						</span>
					</div>
					<div>
						<span className="text-[10px] text-red-400 uppercase tracking-wider block mb-0.5">
							Deuda Actual
						</span>
						<span className="font-mono text-sm font-bold text-red-400">
							${formatCOP(debtor.total_debt)}
						</span>
					</div>
				</div>

				{/* Pestañas de Navegación */}
				<div className="flex border-b border-gray-800/80">
					<button
						type="button"
						onClick={() => setActiveTab("debts")}
						className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
							activeTab === "debts"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-gray-400 hover:text-gray-200"
						}`}
					>
						<Receipt className="w-4 h-4" />
						<span>Deudas Fiadas ({debts.length})</span>
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("payments")}
						className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
							activeTab === "payments"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-gray-400 hover:text-gray-200"
						}`}
					>
						<CreditCard className="w-4 h-4" />
						<span>Historial Abonos ({payments.length})</span>
					</button>
				</div>

				{/* Contenido de Deudas y Pagos */}
				{isLoading ? (
					<div className="py-10 text-center text-xs text-gray-500">
						Cargando estado de cuenta...
					</div>
				) : activeTab === "debts" ? (
					<div className="space-y-3 max-h-80 overflow-y-auto pr-1">
						{debts.length === 0 ? (
							<div className="text-center py-8 bg-[#182232]/40 rounded-xl border border-gray-800/50">
								<p className="text-xs text-gray-500">
									No posee deudas registradas.
								</p>
							</div>
						) : (
							debts.map((d) => {
								const paidAmount = d.total_amount - d.remaining_amount;

								return (
									<div
										key={d.id}
										className="bg-[#182232] border border-gray-800/80 rounded-2xl p-4 space-y-3"
									>
										<div className="flex items-start justify-between gap-2">
											<div>
												<h4 className="text-sm font-medium text-gray-100">
													{d.description || "Consumo / Fiado General"}
												</h4>
												<p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-1">
													<Calendar className="w-3.5 h-3.5 text-gray-500" />
													<span>
														{new Date(d.created_at).toLocaleDateString(
															"es-CO",
															{
																day: "2-digit",
																month: "short",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															},
														)}
													</span>
												</p>
											</div>
											<DebtorStatusBadge status={d.status} />
										</div>

										<div className="grid grid-cols-3 gap-2 bg-[#1f2937]/50 rounded-xl p-2.5 text-xs border border-gray-800/50">
											<div>
												<span className="text-[10px] text-gray-500 block">
													Monto Inicial
												</span>
												<span className="font-mono font-medium text-gray-300">
													${formatCOP(d.total_amount)}
												</span>
											</div>
											<div>
												<span className="text-[10px] text-gray-500 block">
													Abonado
												</span>
												<span className="font-mono font-medium text-emerald-400">
													${formatCOP(paidAmount)}
												</span>
											</div>
											<div>
												<span className="text-[10px] text-gray-500 block">
													Saldo Restante
												</span>
												<span className="font-mono font-bold text-red-400">
													${formatCOP(d.remaining_amount)}
												</span>
											</div>
										</div>

										{d.status !== "PAGADO" && (
											<div className="flex justify-end pt-1">
												<button
													type="button"
													onClick={() => setSelectedDebtForPayment(d)}
													className="w-full sm:w-auto px-4 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
												>
													<ArrowDownCircle className="w-4 h-4" />
													<span>Abonar a este fiado</span>
												</button>
											</div>
										)}
									</div>
								);
							})
						)}
					</div>
				) : (
					<div className="space-y-3 max-h-80 overflow-y-auto pr-1">
						{payments.length === 0 ? (
							<div className="text-center py-8 bg-[#182232]/40 rounded-xl border border-gray-800/50">
								<p className="text-xs text-gray-500">
									No se han realizado abonos todavía.
								</p>
							</div>
						) : (
							payments.map((p) => (
								<div
									key={p.id}
									className="bg-[#182232] border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between"
								>
									<div className="space-y-1">
										<div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
											<CheckCircle2 className="w-4 h-4" />
											<span>Abono Recibido</span>
										</div>
										<p className="text-[11px] text-gray-400 flex items-center gap-1.5">
											<Clock className="w-3.5 h-3.5 text-gray-500" />
											<span>
												{new Date(p.created_at).toLocaleString("es-CO", {
													dateStyle: "medium",
													timeStyle: "short",
												})}
											</span>
										</p>
									</div>
									<div className="text-right">
										<span className="text-[10px] text-gray-500 block uppercase">
											Monto Pago
										</span>
										<span className="font-mono text-base font-bold text-emerald-400">
											+${formatCOP(p.amount)}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>

			{/* Modal para Abonar */}
			{selectedDebtForPayment && (
				<PayDebtModal
					isOpen={!!selectedDebtForPayment}
					debt={selectedDebtForPayment}
					currentTotalDebt={debtor.total_debt}
					onClose={() => setSelectedDebtForPayment(null)}
					onSuccess={handlePaymentSuccess}
					storeId={storeId}
					userId={userId}
				/>
			)}
		</Modal>
	);
};
