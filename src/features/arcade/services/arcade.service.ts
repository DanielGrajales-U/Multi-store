import { supabase } from "@/lib/supabase";
import type { CreateReadingFormData } from "../schemas/reading.schema";
import type { ArcadeMachine, MachineReading } from "../types/arcade.types";

export const getMachinesByStore = async (
	storeId: string,
): Promise<ArcadeMachine[]> => {
	const { data, error } = await supabase
		.from("arcade_machines")
		.select(`
      *,
      last_reading:machine_readings(
        in_counter_current,
        out_counter_current,
        created_at
      )
    `)
		.eq("store_id", storeId)
		.eq("is_active", true)
		.order("code", { ascending: true })
		.limit(1, { foreignTable: "machine_readings" });

	if (error)
		throw new Error("Error al cargar las maquinitas: " + error.message);

	return (data || []).map((m) => ({
		...m,
		last_reading: m.last_reading?.[0] || undefined,
	}));
};

export const createReading = async (
	data: CreateReadingFormData,
	storeId: string,
	userId: string,
	profitSharePercentage: number,
): Promise<MachineReading> => {
	const inDiff = data.in_counter_current - data.in_counter_previous;
	const outDiff = data.out_counter_current - data.out_counter_previous;

	const grossAmount = (inDiff - outDiff) * data.coin_value;
	const netAmount = (grossAmount * profitSharePercentage) / 100;

	const { data: newReading, error } = await supabase
		.from("machine_readings")
		.insert({
			machine_id: data.machine_id,
			store_id: storeId,
			recorded_by: userId,
			in_counter_previous: data.in_counter_previous,
			in_counter_current: data.in_counter_current,
			out_counter_previous: data.out_counter_previous,
			out_counter_current: data.out_counter_current,
			gross_amount: grossAmount,
			net_amount: netAmount,
			notes: data.notes,
		})
		.select()
		.single();

	if (error) throw new Error("Error al guardar la lectura: " + error.message);
	return newReading;
};
