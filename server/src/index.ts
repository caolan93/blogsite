import Fastify, {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from 'fastify';

const fastify: FastifyInstance = Fastify({
	logger: true,
});

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
	return { hello: 'world' };
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
