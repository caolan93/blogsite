export const updateQuery = (
	id: number,
	arr: Record<string, string | number>,
) => {
	let setClauses: Array<string> = [];
	let values: Array<number | string> = [id.toString()];

	Object.entries(arr).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		setClauses.push(`${key}=$${setClauses.length + 2}`);
		values.push(value);
	});

	setClauses.push(`updated_at=$${setClauses.length + 2}`);
	values.push(new Date().toISOString());

	return { setClauses, values };
};
