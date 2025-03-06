import fastifyAutoload from '@fastify/autoload';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { config } from 'dotenv';
import Fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from './plugins/cors.js';
import dbConnector from './plugins/database.js';

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

// This loads all plugins defined in routes
// define your routes in one of these
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PLUGINS
fastify.register(cors);
fastify.register(fastifyPlugin(dbConnector));
fastify.register(fastifyAutoload, {
	dir: join(__dirname, './routes'),
	autoHooks: true,
	cascadeHooks: true,
	options: { prefix: '/api/v1' },
});

// If database fails to connect don't start server
async function main() {
	try {
		await fastify.register(dbConnector);
		await start();
	} catch (err) {
		fastify.log.error('Application startup error:', err);
		process.exit(1);
	}
}

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
