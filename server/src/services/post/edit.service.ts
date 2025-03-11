import { PostgresDb } from '@fastify/postgres';

export const editService = async (
	db: PostgresDb,
	id: number,
	title: string,
	post: string,
) => {
	try {
		const { setClauses, values } = updateQuery(id, { title, post });
		const dbQuery = `
        UPDATE posts
        SET ${setClauses.join(', ')}
        WHERE id=$1
        RETURNING *;`;
		const { rows } = await db.query(dbQuery, values);

		return rows;
	} catch (error) {
		throw error;
	}
};

const updateQuery = (id: number, obj: Record<string, string | number>) => {
	let setClauses: Array<string> = [];
	let values: Array<number | string> = [id.toString()];

	Object.entries(obj).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		setClauses.push(`${key}=$${setClauses.length + 2}`);
		values.push(value);
	});

	setClauses.push(`updated_at=$${setClauses.length + 2}`);
	values.push(new Date().toISOString());

	return { setClauses, values };
};
