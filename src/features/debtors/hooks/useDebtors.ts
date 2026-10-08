import { useCallback, useEffect, useState } from "react";
import { debtorsService } from "../services/debtors.service";
import type { Debtor } from "../types/debtors.types";

export const useDebtors = (storeId?: string) => {
	const [debtors, setDebtors] = useState<Debtor[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchDebtors = useCallback(async () => {
		if (!storeId) return;
		setIsLoading(true);
		try {
			const data = await debtorsService.getDebtors(storeId);
			setDebtors(data);
		} catch (error) {
			console.error("Error al cargar deudores:", error);
		} finally {
			setIsLoading(false);
		}
	}, [storeId]);

	useEffect(() => {
		fetchDebtors();
	}, [fetchDebtors]);

	// Filtrado de deudores en memoria
	const filteredDebtors = debtors.filter(
		(d) =>
			d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			d.phone?.includes(searchQuery),
	);

	return {
		debtors: filteredDebtors,
		isLoading,
		searchQuery,
		setSearchQuery,
		refetch: fetchDebtors,
	};
};
