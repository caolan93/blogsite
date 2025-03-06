import { FastifyReply, FastifyRequest } from 'fastify';

export default async function create(
	request: FastifyRequest<{
		Body: { title: string; post: string };
	}>,
	reply: FastifyReply,
) {
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

	return reply.code(201).send({
		message: 'Your blog post was saved successfully!',
	});
}
