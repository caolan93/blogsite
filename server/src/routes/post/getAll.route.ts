import { FastifyReply, FastifyRequest } from 'fastify';
import { getAll as getAllService } from '../../services/post/getAll.service.js';

export default async function getAll(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { db } = request.server;

	try {
		const rows = getAllService(db);

		return reply.code(200).header('Content-Type', 'application/json').send({
			posts: rows,
		});
	} catch (error) {
		request.server.log.error('Error inserting post:', error);
		return reply.code(500).send({
			message: 'Internal server error',
		});
	}
}
