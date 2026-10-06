// src/features/arcade/components/ReadingModal.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import {
	type CreateReadingFormData,
	createReadingSchema,
} from "../schemas/reading.schema";
import type { ArcadeMachine } from "../types/arcade.types";

interface ReadingModalProps {
	isOpen: boolean;
	onClose: () => void;
	machine: ArcadeMachine | null;
	onSubmitReading: (
		data: CreateReadingFormData,
		profitSharePercentage: number,
	) => Promise<boolean>;
}

export const ReadingModal = ({
	isOpen,
	onClose,
	machine,
	onSubmitReading,
}: ReadingModalProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 1. TODOS los hooks se declaran primero sin retornos anticipados (early returns)
	const prevIn = machine?.last_reading?.in_counter_current ?? 0;
	const prevOut = machine?.last_reading?.out_counter_current ?? 0;
	const machineCoinValue = machine?.coin_value ?? 200;

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateReadingFormData>({
		resolver: zodResolver(createReadingSchema),
		defaultValues: {
			machine_id: machine?.id ?? "",
			in_counter_previous: prevIn,
			in_counter_current: prevIn,
			out_counter_previous: prevOut,
			out_counter_current: prevOut,
			coin_value: machineCoinValue,
			notes: "",
		},
	});

	// 2. Sincronizar el formulario cada vez que cambie la máquina seleccionada
	useEffect(() => {
		if (machine) {
			const currentPrevIn = machine.last_reading?.in_counter_current ?? 0;
			const currentPrevOut = machine.last_reading?.out_counter_current ?? 0;
			const currentCoinValue = machine.coin_value ?? 200;

			reset({
				machine_id: machine.id,
				in_counter_previous: currentPrevIn,
				in_counter_current: currentPrevIn,
				out_counter_previous: currentPrevOut,
				out_counter_current: currentPrevOut,
				coin_value: currentCoinValue,
				notes: "",
			});
		}
	}, [machine, reset]);

	// 3. Observadores para cálculo dinámico
	const currentIn = watch("in_counter_current") || 0;
	const currentOut = watch("out_counter_current") || 0;
	const coinValue = watch("coin_value") || machineCoinValue;

	// 4. Retorno anticipado solo después de haber ejecutado todos los Hooks
	if (!machine) return null;

	const diffIn = Math.max(0, currentIn - prevIn);
	const diffOut = Math.max(0, currentOut - prevOut);
	const grossAmount = (diffIn - diffOut) * coinValue;
	const netAmount = (grossAmount * machine.profit_share_percentage) / 100;

	const handleFormSubmit = async (data: CreateReadingFormData) => {
		setIsSubmitting(true);
		try {
			const ok = await onSubmitReading(data, machine.profit_share_percentage);
			if (ok) {
				reset();
				onClose();
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Cierre - ${machine.name} (${machine.code})`}
			description="Digita la lectura actual de los contadores físicos."
		>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				{/* Valor de Ficha / Moneda */}
				<div className="bg-[#1f2937]/40 p-3 rounded-xl border border-gray-800">
					<Input
						label="Valor por Moneda / Ficha ($)"
						type="number"
						error={errors.coin_value?.message}
						{...register("coin_value", { valueAsNumber: true })}
					/>
				</div>

				{/* Contadores Entradas */}
				<div className="grid grid-cols-2 gap-3 bg-[#1f2937]/40 p-3 rounded-xl border border-gray-800 items-end">
					<div>
						<span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
							Anterior (IN)
						</span>
						<span className="font-mono text-sm font-semibold text-gray-300">
							{prevIn}
						</span>
					</div>
					<Input
						label="Actual Entrada (IN)"
						type="number"
						error={errors.in_counter_current?.message}
						{...register("in_counter_current", { valueAsNumber: true })}
					/>
				</div>

				{/* Contadores Salidas */}
				<div className="grid grid-cols-2 gap-3 bg-[#1f2937]/40 p-3 rounded-xl border border-gray-800 items-end">
					<div>
						<span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
							Anterior (OUT)
						</span>
						<span className="font-mono text-sm font-semibold text-gray-300">
							{prevOut}
						</span>
					</div>
					<Input
						label="Actual Salida (OUT)"
						type="number"
						error={errors.out_counter_current?.message}
						{...register("out_counter_current", { valueAsNumber: true })}
					/>
				</div>

				{/* Observaciones opcionales */}
				<Input
					label="Observaciones (Opcional)"
					type="text"
					placeholder="Ej. Cambio de tragamonedas..."
					error={errors.notes?.message}
					{...register("notes")}
				/>

				{/* Resumen Calculado */}
				<div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 space-y-2">
					<div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
						<Calculator className="w-4 h-4" />
						<span>Resumen del Cierre</span>
					</div>

					<div className="flex justify-between text-xs text-gray-400">
						<span>Diferencia de Fichas:</span>
						<span className="font-mono font-semibold text-gray-200">
							+{diffIn} IN / -{diffOut} OUT
						</span>
					</div>

					<div className="flex justify-between text-xs text-gray-400">
						<span>Utilidad Bruta (Total $):</span>
						<span className="font-mono font-semibold text-gray-100">
							${grossAmount.toLocaleString()}
						</span>
					</div>

					<div className="flex justify-between text-xs text-gray-400 border-t border-blue-500/20 pt-2">
						<span>Participación ({machine.profit_share_percentage}%):</span>
						<span className="font-mono font-bold text-blue-400 text-sm">
							${netAmount.toLocaleString()}
						</span>
					</div>
				</div>

				{/* Botones de Acción */}
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
							<Save className="w-4 h-4" />
						)}
						<span>Guardar Cierre</span>
					</button>
				</div>
			</form>
		</Modal>
	);
};
