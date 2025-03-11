import { FastifyReply, FastifyRequest } from 'fastify';
import { editService } from '../../services/post/edit.service.js';

export default async function edit(
	request: FastifyRequest<{
		Body: { id: number; title: string; post: string };
	}>,
	reply: FastifyReply,
) {
	const { db } = request.server;
	const { id, title, post } = request.body;

	if (!id) {
		return reply.code(422).send({
			message: 'An id is needed for each blog post',
		});
	}

	try {
		const rows = await editService(db, id, title, post);

		if (rows.length === 0) {
			return reply.code(500).send({ message: 'Failed to update post.' });
		}

		return reply.code(201).send({
			message: 'Your blog post was updated successfully!',
			post: rows[0],
		});
	} catch (error) {
		request.server.log.error('Error updating post:', error);
		return reply.code(500).send({
			message: 'Internal server error',
		});
	}
}
