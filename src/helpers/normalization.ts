export const normalization = (str: string) => {
	return str
		.normalize("NFD")
		.replace(/[^a-zA-Z\s]/g, "")
		.replace(/\s/g, "")
		.toLowerCase();
};
