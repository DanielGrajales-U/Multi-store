import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { CreateReadingFormData } from "../schemas/reading.schema";
import { createReading, getMachinesByStore } from "../services/arcade.service";
import type { ArcadeMachine } from "../types/arcade.types";

export const useArcade = () => {
	const { activeStore, user } = useAuthStore();
	const [machines, setMachines] = useState<ArcadeMachine[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMachines = useCallback(async () => {
		if (!activeStore?.id) return;
		setIsLoading(true);
		setError(null);
		try {
			const data = await getMachinesByStore(activeStore.id);
			setMachines(data);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setIsLoading(false);
		}
	}, [activeStore?.id]);

	useEffect(() => {
		fetchMachines();
	}, [fetchMachines]);

	const submitReading = async (
		data: CreateReadingFormData,
		profitShare: number,
	) => {
		if (!activeStore?.id || !user?.id) return false;
		try {
			await createReading(data, activeStore.id, user.id, profitShare);
			await fetchMachines(); // Recargar estado tras guardar
			return true;
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Error guardando lectura");
			return false;
		}
	};

	return {
		machines,
		isLoading,
		error,
		refresh: fetchMachines,
		submitReading,
	};
};
