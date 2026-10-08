export type DebtStatus = "PENDIENTE" | "PARCIAL" | "PAGADO";

export interface Debtor {
	id: string;
	store_id: string;
	full_name: string;
	phone?: string | null;
	total_debt: number;
	created_at: string;
}

export interface Debt {
	id: string;
	debtor_id: string;
	store_id: string;
	recorded_by?: string | null;
	total_amount: number;
	remaining_amount: number;
	status: DebtStatus;
	description?: string | null;
	created_at: string;
	debtor?: Debtor;
}

export interface DebtPayment {
	id: string;
	debt_id: string;
	debtor_id: string;
	amount: number;
	recorded_by?: string | null;
	created_at: string;
}
