import { FastifyReply, FastifyRequest } from 'fastify';

export default async function create(
	request: FastifyRequest<{
		Body: { title: string; post: string };
	}>,
	reply: FastifyReply,
) {
	const { db } = request.server;
	const { title, post } = request.body;

	if (!title) {
		return reply.code(422).send({
			message: 'A title is needed for each blog post',
		});
	}

	if (!post) {
		return reply.code(422).send({
			message: 'Each blog post must contain text.',
		});
	}

	try {
		const dbQuery = `INSERT INTO posts (title, post) VALUES ($1, $2) RETURNING *`;
		const { rows } = await db.query(dbQuery, [title, post]);
		if (rows.length === 0) {
			return reply.code(500).send({ message: 'Failed to create post.' });
		}

		return reply.code(201).send({
			message: 'Your blog post was saved successfully!',
			post: rows[0],
		});
	} catch (error) {
		request.server.log.error('Error inserting post:', error);
		return reply.code(500).send({
			message: 'Internal server error',
		});
	}
}
