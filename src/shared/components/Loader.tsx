import { Loader2 } from "lucide-react";

interface PageLoaderProps {
	message?: string;
}

export const PageLoader = ({
	message = "Cargando módulo...",
}: PageLoaderProps) => {
	return (
		<div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 p-6">
			<div className="relative flex items-center justify-center">
				<div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
					<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
				</div>
			</div>
			<p className="text-xs font-medium text-gray-400 tracking-wide animate-pulse">
				{message}
			</p>
		</div>
	);
};
