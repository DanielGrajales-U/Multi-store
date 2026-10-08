import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CurrencyInput } from "@/shared/components/CurrencyInput";
import { Input } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { useDebtorsMutations } from "../hooks/useDebtorsMutations";
import {
	type CreateDebtorFormData,
	createDebtorSchema,
} from "../schemas/debtors.schema";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	storeId: string;
	userId: string;
}

export const CreateDebtorModal = ({
	isOpen,
	onClose,
	onSuccess,
	storeId,
	userId,
}: Props) => {
	const [hasInitialDebt, setHasInitialDebt] = useState(false);
	const [initialAmount, setInitialAmount] = useState<number>(0);
	const [initialDescription, setInitialDescription] = useState<string>("");

	const { createDebtor, isSubmitting } = useDebtorsMutations(
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
	} = useForm<CreateDebtorFormData>({
		resolver: zodResolver(createDebtorSchema),
	});

	const handleFormSubmit = async (data: CreateDebtorFormData) => {
		const initialDebtPayload =
			hasInitialDebt && initialAmount > 0
				? {
						amount: initialAmount,
						description: initialDescription || "Deuda inicial",
					}
				: undefined;

		const ok = await createDebtor(data, initialDebtPayload);
		if (ok) {
			reset();
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Nuevo Cliente Deudor"
			description="Registra a un cliente para asignarle fiados o préstamos."
		>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				<Input
					label="Nombre Completo"
					type="text"
					placeholder="Ej. Juan Pérez"
					error={errors.full_name?.message}
					{...register("full_name")}
				/>

				<Input
					label="Teléfono / Celular (Opcional)"
					type="text"
					placeholder="Ej. 3001234567"
					error={errors.phone?.message}
					{...register("phone")}
				/>

				{/* Checkbox para añadir fiado inicial */}
				<div className="pt-2 border-t border-gray-800">
					<label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
						<input
							type="checkbox"
							checked={hasInitialDebt}
							onChange={(e) => setHasInitialDebt(e.target.checked)}
							className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500/20"
						/>
						<span>¿Registrar fiado/préstamo de una vez?</span>
					</label>
				</div>

				{/* Campos condicionales de la deuda inicial */}
				{hasInitialDebt && (
					<div className="bg-[#1f2937]/40 p-3 rounded-xl border border-gray-800 space-y-3">
						<div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
							<DollarSign className="w-4 h-4" />
							<span>Detalle de la Deuda Inicial</span>
						</div>

						<Input
							label="Monto Inicial ($)"
							type="number"
							placeholder="0"
							value={initialAmount || ""}
							onChange={(e) => setInitialAmount(Number(e.target.value))}
						/>

						<Input
							label="Concepto / Descripción"
							type="text"
							placeholder="Ej. Consumo de tienda, tiempo o préstamo efectivo..."
							value={initialDescription}
							onChange={(e) => setInitialDescription(e.target.value)}
						/>
					</div>
				)}

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
							<UserPlus className="w-4 h-4" />
						)}
						<span>Guardar Cliente</span>
					</button>
				</div>
			</form>
		</Modal>
	);
};
