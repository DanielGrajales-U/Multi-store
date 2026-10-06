import { ArrowRight, Building2, MapPin, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const StoreSelectorPage = () => {
	const { stores, setActiveStore } = useAuthStore();
	const navigate = useNavigate();

	const handleSelectStore = (store: (typeof stores)[0]) => {
		setActiveStore(store);
		navigate(`/tienda/${store.id}/maquinitas`);
	};

	return (
		<div className="min-h-screen w-full bg-[#0b0f17] flex items-center justify-center p-6 relative overflow-hidden">
			{/* Visual background element */}
			<div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

			<div className="w-full max-w-4xl relative z-10">
				<div className="text-center mb-10">
					<div className="inline-flex p-3 bg-blue-600/15 border border-blue-500/30 text-blue-400 rounded-2xl mb-4">
						<Building2 className="w-8 h-8" />
					</div>
					<h1 className="text-3xl font-bold text-gray-100 tracking-tight">
						Selecciona una Tienda
					</h1>
					<p className="text-sm text-gray-400 mt-2">
						Elige la sede que deseas administrar en esta sesión
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{stores?.map((store) => (
						<div
							key={store.id}
							onClick={() => handleSelectStore(store)}
							className="group bg-[#111827] border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
						>
							<div>
								<div className="w-12 h-12 bg-gray-800/80 group-hover:bg-blue-600/20 group-hover:text-blue-400 text-gray-300 rounded-xl flex items-center justify-center mb-4 transition-all">
									<Store className="w-6 h-6" />
								</div>
								<h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
									{store.name}
								</h3>
								{store.address && (
									<p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
										<MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
										<span>{store.address}</span>
									</p>
								)}
							</div>

							<div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs font-medium text-blue-400">
								<span>Ingresar al panel</span>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
