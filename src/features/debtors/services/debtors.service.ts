import { supabase } from "@/lib/supabase";
import type {
	CreateDebtFormData,
	CreateDebtorFormData,
	CreatePaymentFormData,
} from "../schemas/debtors.schema";
import type { Debt, Debtor, DebtPayment } from "../types/debtors.types";

export const debtorsService = {
	// Obtener lista de deudores con su deuda acumulada
	async getDebtors(storeId: string): Promise<Debtor[]> {
		const { data, error } = await supabase
			.from("debtors")
			.select("*")
			.eq("store_id", storeId)
			.order("total_debt", { ascending: false });

		if (error) throw error;
		return data ?? [];
	},

	// Obtener deudas activas/historial de un deudor específico
	async getDebtorDebts(debtorId: string): Promise<Debt[]> {
		const { data, error } = await supabase
			.from("debts")
			.select("*")
			.eq("debtor_id", debtorId)
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data ?? [];
	},

	// Obtener historial de abonos de un deudor
	async getDebtorPayments(debtorId: string): Promise<DebtPayment[]> {
		const { data, error } = await supabase
			.from("debt_payments")
			.select("*")
			.eq("debtor_id", debtorId)
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data ?? [];
	},

	// Crear Cliente + Deuda inicial opcional
	async createDebtorWithDebt(
		storeId: string,
		userId: string,
		debtorData: CreateDebtorFormData,
		initialDebt?: { amount: number; description: string },
	) {
		// 1. Crear el deudor
		const { data: debtor, error: debtorError } = await supabase
			.from("debtors")
			.insert({
				store_id: storeId,
				full_name: debtorData.full_name,
				phone: debtorData.phone || null,
				total_debt: initialDebt ? initialDebt.amount : 0,
			})
			.select()
			.single();

		if (debtorError) throw debtorError;

		// 2. Si venía con deuda inicial, registrar la primera deuda
		if (initialDebt && initialDebt.amount > 0) {
			const { error: debtError } = await supabase.from("debts").insert({
				debtor_id: debtor.id,
				store_id: storeId,
				recorded_by: userId,
				total_amount: initialDebt.amount,
				remaining_amount: initialDebt.amount,
				status: "PENDIENTE",
				description: initialDebt.description,
			});

			if (debtError) throw debtError;
		}

		return debtor;
	},

	// Crear nueva deuda a cliente existente
	async createDebt(
		storeId: string,
		userId: string,
		data: CreateDebtFormData,
		currentTotalDebt: number,
	) {
		// 1. Insertar registro de deuda
		const { error: debtError } = await supabase.from("debts").insert({
			debtor_id: data.debtor_id,
			store_id: storeId,
			recorded_by: userId,
			total_amount: data.total_amount,
			remaining_amount: data.total_amount,
			status: "PENDIENTE",
			description: data.description,
		});

		if (debtError) throw debtError;

		// 2. Actualizar acumulado total del deudor
		const { error: updateError } = await supabase
			.from("debtors")
			.update({ total_debt: currentTotalDebt + data.total_amount })
			.eq("id", data.debtor_id);

		if (updateError) throw updateError;
	},

	// Registrar Abono a una Deuda
	async registerPayment(
		storeId: string,
		userId: string,
		debt: Debt,
		currentTotalDebt: number,
		paymentData: CreatePaymentFormData,
	) {
		const paymentAmount = paymentData.amount;
		const newRemaining = Math.max(0, debt.remaining_amount - paymentAmount);
		const newStatus =
			newRemaining === 0
				? "PAGADO"
				: newRemaining < debt.total_amount
					? "PARCIAL"
					: "PENDIENTE";

		// 1. Insertar el abono
		const { error: paymentError } = await supabase
			.from("debt_payments")
			.insert({
				debt_id: debt.id,
				debtor_id: debt.debtor_id,
				amount: paymentAmount,
				recorded_by: userId,
			});

		if (paymentError) throw paymentError;

		// 2. Actualizar estado y saldo restante de la deuda
		const { error: debtUpdateError } = await supabase
			.from("debts")
			.update({
				remaining_amount: newRemaining,
				status: newStatus,
			})
			.eq("id", debt.id);

		if (debtUpdateError) throw debtUpdateError;

		// 3. Actualizar la deuda total en el perfil del cliente
		const { error: debtorUpdateError } = await supabase
			.from("debtors")
			.update({
				total_debt: Math.max(0, currentTotalDebt - paymentAmount),
			})
			.eq("id", debt.debtor_id);

		if (debtorUpdateError) throw debtorUpdateError;
	},
};
