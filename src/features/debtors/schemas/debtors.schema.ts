import { z } from "zod";

// Registrar un Deudor/Cliente
export const createDebtorSchema = z.object({
	full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	phone: z.string().optional(),
});

// Registrar una Deuda (Fiado / Préstamo)
export const createDebtSchema = z.object({
	debtor_id: z.string().uuid("Selecciona un deudor válido"),
	total_amount: z.number().gt(0, "El monto debe ser mayor a 0"),
	description: z.string().min(3, "Ingresa una descripción o concepto"),
});

// Registrar un Abono
export const createPaymentSchema = z.object({
	debt_id: z.string().uuid(),
	debtor_id: z.string().uuid(),
	amount: z.number().gt(0, "El monto abonado debe ser mayor a 0"),
});

export type CreateDebtorFormData = z.infer<typeof createDebtorSchema>;
export type CreateDebtFormData = z.infer<typeof createDebtSchema>;
export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
