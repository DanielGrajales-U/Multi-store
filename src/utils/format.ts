export const formatCOP = (amount: number): string => {
	if (Number.isNaN(amount) || amount === null || amount === undefined)
		return "0";
	return new Intl.NumberFormat("es-CO", {
		maximumFractionDigits: 0,
	}).format(amount);
};
