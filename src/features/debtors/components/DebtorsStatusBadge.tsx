import type { DebtStatus } from "../types/debtors.types";

interface Props {
	status: DebtStatus;
}

export const DebtorStatusBadge = ({ status }: Props) => {
	const styles = {
		PENDIENTE: "bg-red-500/10 text-red-400 border-red-500/20",
		PARCIAL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		PAGADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
	};

	return (
		<span
			className={`px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border rounded-full uppercase ${styles[status]}`}
		>
			{status}
		</span>
	);
};
