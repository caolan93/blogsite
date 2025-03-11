import { PostgresDb } from '@fastify/postgres';

export const getAll = async (db: PostgresDb) => {
	try {
		const dbQuery = `SELECT  * FROM posts ORDER BY id DESC`;
		const { rows } = await db.query(dbQuery);
		return rows;
	} catch (error) {
		throw error;
	}
};
