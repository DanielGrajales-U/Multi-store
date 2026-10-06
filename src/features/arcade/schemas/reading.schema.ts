import { z } from "zod";

export const createReadingSchema = z
	.object({
		machine_id: z.string().uuid("Seleccione una máquina válida"),
		in_counter_previous: z.number().min(0),
		in_counter_current: z.number().min(0, "El contador debe ser positivo"),
		out_counter_previous: z.number().min(0),
		out_counter_current: z.number().min(0, "El contador debe ser positivo"),
		coin_value: z
			.number()
			.min(100, "El valor de la ficha/moneda debe ser mayor a 0"), // Ej: 200 o 500 COP
		notes: z.string().optional(),
	})
	.refine((data) => data.in_counter_current >= data.in_counter_previous, {
		message: "El contador de ENTRADA actual no puede ser menor al anterior",
		path: ["in_counter_current"],
	})
	.refine((data) => data.out_counter_current >= data.out_counter_previous, {
		message: "El contador de SALIDA actual no puede ser menor al anterior",
		path: ["out_counter_current"],
	});

export type CreateReadingFormData = z.infer<typeof createReadingSchema>;
