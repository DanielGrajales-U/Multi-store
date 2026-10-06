// src/app/routing/routes.ts

export const AUTH_ROUTES = {
	ROOT: "/auth",
	LOGIN: "login",
};

export const POS_ROUTES = {
	ROOT: "/",
	SELECT_STORE: "tiendas",
	STORE_PARAM: "tienda/:storeId",
	ARCADE: "maquinitas",
	INVENTORY: "inventario",
	SALES: "caja",
	DEBTS: "fiados",
};
