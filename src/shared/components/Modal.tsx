import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: ReactNode;
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	description,
	children,
}: ModalProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Container */}
			<div className="relative w-full max-w-lg bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 transform transition-all">
				<div className="flex items-start justify-between border-b border-gray-800/80 pb-4">
					<div>
						<h2 className="text-lg font-bold text-gray-100">{title}</h2>
						{description && (
							<p className="text-xs text-gray-400 mt-1">{description}</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="p-1.5 text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				<div>{children}</div>
			</div>
		</div>
	);
};
