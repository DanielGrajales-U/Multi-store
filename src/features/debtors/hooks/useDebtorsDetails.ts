import { useCallback, useEffect, useState } from "react";
import { debtorsService } from "../services/debtors.service";
import type { Debt, DebtPayment } from "../types/debtors.types";

export const useDebtorDetails = (
	debtorId?: string,
	isOpen: boolean = false,
) => {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [payments, setPayments] = useState<DebtPayment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDetails = useCallback(async () => {
		if (!debtorId) return;

		setIsLoading(true);
		setError(null);

		try {
			const [debtsData, paymentsData] = await Promise.all([
				debtorsService.getDebtorDebts(debtorId),
				debtorsService.getDebtorPayments(debtorId),
			]);
			setDebts(debtsData);
			setPayments(paymentsData);
		} catch (err: unknown) {
			console.error("Error cargando detalle del deudor:", err);
			setError(
				err instanceof Error ? err.message : "Error al obtener el historial",
			);
		} finally {
			setIsLoading(false);
		}
	}, [debtorId]);

	useEffect(() => {
		if (isOpen && debtorId) {
			fetchDetails();
		}
	}, [isOpen, debtorId, fetchDetails]);

	// Cálculos derivados
	const totalOriginal = debts.reduce((acc, d) => acc + d.total_amount, 0);
	const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);

	return {
		debts,
		payments,
		totalOriginal,
		totalPaid,
		isLoading,
		error,
		refetchDetails: fetchDetails,
	};
};
