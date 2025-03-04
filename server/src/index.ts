import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { config } from 'dotenv';
import fastifyPlugin from 'fastify-plugin';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from './plugins/cors.js';
import fastifyAutoload from '@fastify/autoload';

function getLoggerOptions() {
	if (process.stdout.isTTY) {
		return {
			level: 'info',
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname',
				},
			},
		};
	}
	return { level: 'silent' };
}

config();
const fastify = Fastify({
	logger: getLoggerOptions(),
}).withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);
		await fastify.register(cors);
		// await fastify.register(fastifyPlugin(mongodbConnector));
		// await fastify.register(jwtPlugin);
		// await fastify.register(swagger);

		// This loads all plugins defined in routes
		// define your routes in one of these
		fastify.register(fastifyAutoload, {
			dir: join(__dirname, './routes'),
			autoHooks: true,
			cascadeHooks: true,
			options: { prefix: '/api/v1' },
		});

		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
