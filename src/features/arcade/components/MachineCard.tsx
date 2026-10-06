import { PlusCircle } from "lucide-react";
import type { ArcadeMachine } from "../types/arcade.types";

interface MachineCardProps {
	machine: ArcadeMachine;
	onOpenReadingModal: (machine: ArcadeMachine) => void;
}

export const MachineCard = ({
	machine,
	onOpenReadingModal,
}: MachineCardProps) => {
	return (
		<div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-5 hover:border-gray-700/80 transition-all flex flex-col justify-between">
			<div>
				<div className="flex items-center justify-between mb-3">
					<span className="text-xs font-mono font-bold bg-blue-950/60 text-blue-400 border border-blue-800/40 px-2.5 py-1 rounded-lg">
						{machine.code}
					</span>
					<span className="text-xs text-gray-400 font-medium">
						Participación: {machine.profit_share_percentage}%
					</span>
				</div>

				<h3 className="font-semibold text-gray-100 text-base">
					{machine.name}
				</h3>

				<div className="mt-4 pt-3 border-t border-gray-800/60 space-y-1.5 text-xs">
					<div className="flex justify-between text-gray-400">
						<span>Última Entrada:</span>
						<span className="font-mono text-gray-200">
							{machine.last_reading?.in_counter_current ?? 0}
						</span>
					</div>
					<div className="flex justify-between text-gray-400">
						<span>Última Salida:</span>
						<span className="font-mono text-gray-200">
							{machine.last_reading?.out_counter_current ?? 0}
						</span>
					</div>
				</div>
			</div>

			<button
				onClick={() => onOpenReadingModal(machine)}
				className="mt-5 w-full bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
			>
				<PlusCircle className="w-4 h-4" />
				<span>Registrar Cierre</span>
			</button>
		</div>
	);
};
