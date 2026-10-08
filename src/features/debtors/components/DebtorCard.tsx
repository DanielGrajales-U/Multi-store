import { DollarSign, Phone, PlusCircle, User } from "lucide-react";
import { formatCOP } from "@/utils/format";
import type { Debtor } from "../types/debtors.types";

interface Props {
	debtor: Debtor;
	onSelect: (debtor: Debtor) => void;
	onAddDebt: (debtor: Debtor) => void;
}

export const DebtorCard = ({ debtor, onSelect, onAddDebt }: Props) => {
	return (
		<div className="bg-[#182232] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between hover:border-gray-700 transition-all">
			<div>
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
							<User className="w-5 h-5" />
						</div>
						<div>
							<h3 className="font-semibold text-gray-100 text-sm">
								{debtor.full_name}
							</h3>
							{debtor.phone && (
								<p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
									<Phone className="w-3 h-3" />
									{debtor.phone}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
					<span className="text-xs text-gray-400">Deuda Acumulada</span>
					<span className="font-mono text-base font-bold text-red-400 flex items-center">
						<DollarSign className="w-4 h-4 -mr-1" />
						{formatCOP(debtor.total_debt)}
					</span>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-2 pt-2">
				<button
					type="button"
					onClick={() => onSelect(debtor)}
					className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-xl transition-all cursor-pointer"
				>
					Ver Cuenta
				</button>
				<button
					type="button"
					onClick={() => onAddDebt(debtor)}
					className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 border border-blue-500/30 transition-all cursor-pointer"
				>
					<PlusCircle className="w-3.5 h-3.5" />
					<span>Fiar</span>
				</button>
			</div>
		</div>
	);
};
