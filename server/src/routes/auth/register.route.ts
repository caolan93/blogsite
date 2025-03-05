import { FastifyReply, FastifyRequest } from 'fastify';

export default async function register(
	request: FastifyRequest<{
		Body: { email: string; firstName: string; lastName: string };
	}>,
	reply: FastifyReply,
) {
	const { firstName, lastName, email } = request.body;

	return reply.code(201).send({
		message: 'hello',
		firstName,
		lastName,
		email,
	});
}
