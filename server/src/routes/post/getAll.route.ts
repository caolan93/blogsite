import { FastifyReply, FastifyRequest } from 'fastify';

export default async function getAll(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { db } = request.server;

	try {
		const dbQuery = `SELECT  * FROM posts`;
		const data = await db.query(dbQuery);

		return reply.code(200).send({
			posts: data.rows,
		});
	} catch (error) {
		request.server.log.error('Error inserting post:', error);
		return reply.code(500).send({
			message: 'Internal server error',
		});
	}
}
