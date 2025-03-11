import { PostgresDb } from '@fastify/postgres';

export const deletePost = async (db: PostgresDb, id: string) => {
	try {
		const deleteQuery = 'DELETE FROM posts WHERE id=$1';
		const data = await db.query(deleteQuery, [id]);
		return data;
	} catch (error) {
		throw error;
	}
};
