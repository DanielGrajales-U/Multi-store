export interface ArcadeMachine {
	id: string;
	store_id: string;
	code: string;
	name: string;
	profit_share_percentage: number;
	is_active: boolean;
	created_at: string;
	coin_value: number;
	last_reading?: MachineReading;
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
