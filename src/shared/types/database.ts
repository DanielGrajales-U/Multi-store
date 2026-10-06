export type UserRole = "ADMIN" | "CAJERO";
export type DebtStatus = "PENDIENTE" | "PARCIAL" | "PAGADO";

export interface Store {
	id: string;
	name: string;
	address?: string;
	phone?: string;
	is_active: boolean;
	created_at: string;
}

export interface Profile {
	id: string;
	full_name: string;
	role: UserRole;
	store_id: string | null;
	created_at: string;
}

export interface ArcadeMachine {
	id: string;
	store_id: string;
	code: string;
	name: string;
	profit_share_percentage: number;
	is_active: boolean;
	created_at: string;
}

export interface MachineReading {
	id: string;
	machine_id: string;
	store_id: string;
	recorded_by: string;
	in_counter_previous: number;
	in_counter_current: number;
	out_counter_previous: number;
	out_counter_current: number;
	gross_amount: number;
	net_amount: number;
	notes?: string;
	created_at: string;
}
