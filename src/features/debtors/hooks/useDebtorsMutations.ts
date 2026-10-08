import { useState } from "react";
import type {
	CreateDebtFormData,
	CreateDebtorFormData,
	CreatePaymentFormData,
} from "../schemas/debtors.schema";
import { debtorsService } from "../services/debtors.service";
import type { Debt } from "../types/debtors.types";

export const useDebtorsMutations = (
	storeId?: string,
	userId?: string,
	onSuccess?: () => void,
) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createDebtor = async (
		data: CreateDebtorFormData,
		initialDebt?: { amount: number; description: string },
	) => {
		if (!storeId || !userId) return false;
		setIsSubmitting(true);
		try {
			await debtorsService.createDebtorWithDebt(
				storeId,
				userId,
				data,
				initialDebt,
			);
			onSuccess?.();
			return true;
		} catch (error) {
			console.error("Error creando deudor:", error);
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const createDebt = async (
		data: CreateDebtFormData,
		currentTotalDebt: number,
	) => {
		if (!storeId || !userId) return false;
		setIsSubmitting(true);
		try {
			await debtorsService.createDebt(storeId, userId, data, currentTotalDebt);
			onSuccess?.();
			return true;
		} catch (error) {
			console.error("Error creando deuda:", error);
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const registerPayment = async (
		debt: Debt,
		currentTotalDebt: number,
		data: CreatePaymentFormData,
	) => {
		if (!storeId || !userId) return false;
		setIsSubmitting(true);
		try {
			await debtorsService.registerPayment(
				storeId,
				userId,
				debt,
				currentTotalDebt,
				data,
			);
			onSuccess?.();
			return true;
		} catch (error) {
			console.error("Error al registrar abono:", error);
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		createDebtor,
		createDebt,
		registerPayment,
		isSubmitting,
	};
};
