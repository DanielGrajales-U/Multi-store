import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "@/shared/components/CurrencyInput";
import { Input } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { useDebtorsMutations } from "../hooks/useDebtorsMutations";
import {
	type CreateDebtFormData,
	createDebtSchema,
} from "../schemas/debtors.schema";
import type { Debtor } from "../types/debtors.types";

interface Props {
	isOpen: boolean;
	debtor: Debtor;
	onClose: () => void;
	onSuccess: () => void;
	storeId: string;
	userId: string;
}

export const CreateDebtModal = ({
	isOpen,
	debtor,
	onClose,
	onSuccess,
	storeId,
	userId,
}: Props) => {
	const { createDebt, isSubmitting } = useDebtorsMutations(
		storeId,
		userId,
		onSuccess,
	);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateDebtFormData>({
		resolver: zodResolver(createDebtSchema),
		defaultValues: {
			debtor_id: debtor.id,
		},
	});

	const handleFormSubmit = async (data: CreateDebtFormData) => {
		const ok = await createDebt(data, debtor.total_debt);
		if (ok) {
			reset();
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Registrar Fiado - ${debtor.full_name}`}
			description={`Añadir un nuevo fiado o préstamo a la cuenta actual ($${debtor.total_debt.toLocaleString()}).`}
		>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				<Controller
					name="total_amount"
					control={control}
					render={({ field }) => (
						<CurrencyInput
							label="Monto del Fiado / Préstamo"
							value={field.value}
							onChange={field.onChange}
							error={errors.total_amount?.message}
						/>
					)}
				/>

				<Input
					label="Concepto / Descripción"
					type="text"
					placeholder="Ej. 2 Cervezas + Tiempo de Xbox..."
					error={errors.description?.message}
					{...register("description")}
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
						className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all cursor-pointer"
					>
						{isSubmitting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<PlusCircle className="w-4 h-4" />
						)}
						<span>Agregar Deuda</span>
					</button>
				</div>
			</form>
		</Modal>
	);
};
