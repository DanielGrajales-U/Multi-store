import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, icon, className, ...props }, ref) => {
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
						ref={ref}
						className={clsx(
							"w-full bg-[#1f2937]/60 border rounded-xl py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 transition-all",
							icon ? "pl-10 pr-4" : "px-4",
							error
								? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
								: "border-gray-700/60 focus:border-blue-500 focus:ring-blue-500",
							className,
						)}
						{...props}
					/>
				</div>
				{error && <p className="text-xs text-red-400 mt-1">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
