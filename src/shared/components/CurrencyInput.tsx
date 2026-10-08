import { clsx } from "clsx";
import { forwardRef, type ReactNode } from "react";
import { formatCOP } from "@/utils/format";

interface CurrencyInputProps {
	label?: string;
	error?: string;
	icon?: ReactNode;
	value?: number;
	onChange?: (value: number) => void;
	placeholder?: string;
	className?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
	(
		{
			label,
			error,
			icon,
			value = 0,
			onChange,
			placeholder = "$ 0",
			className,
			...props
		},
		ref,
	) => {
		// Convierte el número actual en string formateado sin decimales para mostrar en el input
		const displayValue = value ? formatCOP(value) : "";

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			// Extrae solo los dígitos numéricos
			const rawValue = e.target.value.replace(/\D/g, "");
			const numericValue = rawValue ? Number.parseInt(rawValue, 10) : 0;
			onChange?.(numericValue);
		};

		return (
			<div className="w-full">
				{label && (
					<label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
						{label}
					</label>
				)}
				<div className="relative">
					{icon && (
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
							{icon}
						</div>
					)}
					<input
						{...props}
						ref={ref}
						type="text"
						inputMode="numeric"
						value={displayValue}
						onChange={handleChange}
						placeholder={placeholder}
						className={clsx(
							"w-full bg-[#1f2937]/60 border rounded-xl py-2.5 text-sm font-mono text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 transition-all",
							icon ? "pl-10 pr-4" : "px-4",
							error
								? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
								: "border-gray-700/60 focus:border-blue-500 focus:ring-blue-500",
							className,
						)}
					/>
				</div>
				{error && <p className="text-xs text-red-400 mt-1">{error}</p>}
			</div>
		);
	},
);

CurrencyInput.displayName = "CurrencyInput";
