// src/features/debtors/components/PayDebtModal.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { useDebtorsMutations } from "../hooks/useDebtorsMutations";
import {
	type CreatePaymentFormData,
	createPaymentSchema,
} from "../schemas/debtors.schema";
import type { Debt } from "../types/debtors.types";

interface Props {
	isOpen: boolean;
	debt: Debt;
	currentTotalDebt: number;
	onClose: () => void;
	onSuccess: () => void;
	storeId: string;
	userId: string;
}

export const PayDebtModal = ({
	isOpen,
	debt,
	currentTotalDebt,
	onClose,
	onSuccess,
	storeId,
	userId,
}: Props) => {
	const { registerPayment, isSubmitting } = useDebtorsMutations(
		storeId,
		userId,
		onSuccess,
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreatePaymentFormData>({
		resolver: zodResolver(createPaymentSchema),
		defaultValues: {
			debt_id: debt.id,
			debtor_id: debt.debtor_id,
			amount: debt.remaining_amount, // Por defecto ofrece pagar el total de esa deuda
		},
	});

	const handleFormSubmit = async (data: CreatePaymentFormData) => {
		const ok = await registerPayment(debt, currentTotalDebt, data);
		if (ok) {
			reset();
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Registrar Abono"
			description={`Abonar a la deuda de "${debt.description || "Sin descripción"}"`}
		>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				<div className="bg-[#1f2937]/40 p-3 rounded-xl border border-gray-800 space-y-1">
					<div className="flex justify-between text-xs text-gray-400">
						<span>Monto Original:</span>
						<span className="font-mono text-gray-200">
							${debt.total_amount.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-xs font-semibold text-gray-200">
						<span>Pendiente por Pagar:</span>
						<span className="font-mono text-red-400">
							${debt.remaining_amount.toLocaleString()}
						</span>
					</div>
				</div>

				<Input
					label="Monto del Abono ($)"
					type="number"
					error={errors.amount?.message}
					{...register("amount", { valueAsNumber: true })}
				/>

				<div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition-all cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
					>
						{isSubmitting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<DollarSign className="w-4 h-4" />
						)}
						<span>Registrar Pago</span>
					</button>
				</div>
			</form>
		</Modal>
	);
};
