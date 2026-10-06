import {
	Dices,
	LogOut,
	Menu,
	Package,
	Receipt,
	RefreshCcw,
	Store,
	Users,
	X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface MainLayoutProps {
	children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
	const { user, activeStore, logout } = useAuthStore();
	const { storeId } = useParams<{ storeId: string }>();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{
			label: "Maquinitas",
			icon: Dices,
			path: `/tienda/${storeId}/maquinitas`,
		},
		{
			label: "Inventario",
			icon: Package,
			path: `/tienda/${storeId}/inventario`,
		},
		{
			label: "Caja / Ventas",
			icon: Receipt,
			path: `/tienda/${storeId}/caja`,
		},
		{
			label: "Fiados / Deudas",
			icon: Users,
			path: `/tienda/${storeId}/fiados`,
		},
	];

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<div className="flex h-screen bg-[#0b0f17] text-gray-100 overflow-hidden">
			{/* Backdrop Mobile */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
					onClick={toggleMobileMenu}
				/>
			)}

			{/* Sidebar Responsive */}
			<aside
				className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111827] border-r border-gray-800/60 flex flex-col justify-between p-4 transform transition-transform duration-200 ease-in-out ${
					isMobileMenuOpen
						? "translate-x-0"
						: "-translate-x-full lg:translate-x-0"
				}`}
			>
				<div>
					<div className="flex items-center justify-between px-2 py-4 border-b border-gray-800/80">
						<div className="flex items-center gap-3">
							<div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl border border-blue-500/30">
								<Store className="w-6 h-6" />
							</div>
							<div>
								<h1 className="font-bold text-base leading-tight text-gray-100">
									POS Tiendas
								</h1>
								<span className="text-xs text-blue-400 font-medium">
									Control & Maquinitas
								</span>
							</div>
						</div>
						<button
							onClick={toggleMobileMenu}
							className="lg:hidden text-gray-400 hover:text-gray-200"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<nav className="mt-6 flex flex-col gap-1.5">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<NavLink
									key={item.path}
									to={item.path}
									onClick={() => setIsMobileMenuOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
											isActive
												? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
												: "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 border border-transparent"
										}`
									}
								>
									<Icon className="w-5 h-5" />
									<span>{item.label}</span>
								</NavLink>
							);
						})}
					</nav>
				</div>

				{/* User Status & Controls */}
				<div className="border-t border-gray-800/80 pt-4 space-y-3 px-2">
					<button
						onClick={() => navigate("/tiendas")}
						className="w-full text-xs text-gray-400 hover:text-blue-300 bg-gray-800/40 hover:bg-gray-800 p-2 rounded-lg flex items-center justify-between transition-all"
					>
						<span>Cambiar de tienda</span>
						<RefreshCcw className="w-3.5 h-3.5" />
					</button>

					<div className="flex items-center justify-between pt-1">
						<div>
							<p className="text-sm font-semibold text-gray-200">
								{user?.full_name || "Usuario"}
							</p>
							<p className="text-xs text-gray-400">{user?.role || "ADMIN"}</p>
						</div>
						<button
							onClick={logout}
							className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
						>
							<LogOut className="w-5 h-5" />
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col overflow-hidden w-full">
				{/* Topbar */}
				<header className="h-16 bg-[#111827] border-b border-gray-800/60 flex items-center justify-between px-4 lg:px-6">
					<div className="flex items-center gap-3">
						<button
							onClick={toggleMobileMenu}
							className="lg:hidden p-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 rounded-lg"
						>
							<Menu className="w-5 h-5" />
						</button>
						<span className="text-xs font-medium uppercase tracking-wider text-gray-400 hidden sm:inline">
							Tienda Activa:
						</span>
						<span className="font-semibold text-blue-300 bg-blue-950/50 px-3 py-1 rounded-lg text-xs sm:text-sm border border-blue-800/40">
							{activeStore?.name || "Cargando..."}
						</span>
					</div>
				</header>

				{/* Dynamic Page Content */}
				<main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#0b0f17]">
					{children}
				</main>
			</div>
		</div>
	);
};
