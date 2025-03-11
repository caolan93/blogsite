import { PostgresDb } from '@fastify/postgres';

export const createPost = async (
	db: PostgresDb,
	title: string,
	post: string,
) => {
	try {
		const dbQuery = `INSERT INTO posts (title, post) VALUES ($1, $2) RETURNING *`;
		const { rows } = await db.query(dbQuery, [title, post]);
		return rows;
	} catch (error) {
		throw error;
	}
};
