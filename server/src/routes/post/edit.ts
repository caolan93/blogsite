import { FastifyReply, FastifyRequest } from 'fastify';
import { updateQuery } from '../../utilities/db.js';

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

	const contruct = {
		title,
		post,
	};

	const { setClauses, values } = updateQuery(id, [contruct]);

	if (setClauses.length === 0) {
		return reply.code(422).send({
			message: 'At least one field (title or post) is required to update',
		});
	}

	const dbQuery = `
    UPDATE posts
    SET ${setClauses.join(', ')}
    WHERE id=$1
    RETURNING *;`;

	try {
		const { rows } = await db.query(dbQuery, values);

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
