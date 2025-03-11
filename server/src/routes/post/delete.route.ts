import { FastifyReply, FastifyRequest } from 'fastify';
import { deletePost as deletePostService } from '../../services/post/delete.service.js';

export default async function deletePost(
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply,
) {
	const { db } = request.server;
	const { id } = request.params;

	if (!id) {
		return reply.code(400).send({ message: 'Missing post ID' });
	}

	try {
		const data = await deletePostService(db, id);

		if (data.rowCount === 0) {
			return reply.code(404).send({ message: 'Post not found' });
		}

		return reply.code(204).send();
	} catch (error) {
		request.server.log.error('Error deleting post:', error);
		return reply.code(500).send({ message: 'Internal server error' });
	}
}
