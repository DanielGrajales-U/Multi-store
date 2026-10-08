import { AlertCircle, Dices, RefreshCw } from "lucide-react";
import { useState } from "react";
import { MachineCard } from "../components/MachineCard";
import { ReadingModal } from "../components/ReadingModal";
import { useArcade } from "../hooks/useArcade";
import type { ArcadeMachine } from "../types/arcade.types";

const ArcadePage = () => {
	const { machines, isLoading, error, refresh, submitReading } = useArcade();
	const [selectedMachine, setSelectedMachine] = useState<ArcadeMachine | null>(
		null,
	);

	const handleOpenModal = (machine: ArcadeMachine) => {
		setSelectedMachine(machine);
	};

	const handleCloseModal = () => {
		setSelectedMachine(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
						<Dices className="w-6 h-6 text-blue-500" />
						Control de Maquinitas
					</h1>
					<p className="text-xs text-gray-400 mt-0.5">
						Registro de contadores y cálculo de utilidades netas
					</p>
				</div>
				<button
					onClick={refresh}
					className="p-2 text-gray-400 hover:text-gray-200 bg-[#1f2937]/50 border border-gray-700/50 rounded-xl transition-all cursor-pointer"
				>
					<RefreshCw className="w-4 h-4" />
				</button>
			</div>

			{error && (
				<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
					<AlertCircle className="w-4 h-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{isLoading ? (
				<div className="text-center py-12 text-gray-500 text-sm">
					Cargando maquinitas...
				</div>
			) : machines.length === 0 ? (
				<div className="text-center py-12 bg-[#111827] border border-gray-800 rounded-2xl">
					<p className="text-gray-400 text-sm">
						No hay maquinitas registradas en esta tienda.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{machines.map((machine) => (
						<MachineCard
							key={machine.id}
							machine={machine}
							onOpenReadingModal={handleOpenModal}
						/>
					))}
				</div>
			)}

			<ReadingModal
				isOpen={!!selectedMachine}
				onClose={handleCloseModal}
				machine={selectedMachine}
				onSubmitReading={submitReading}
			/>
		</div>
	);
};

export default ArcadePage;
