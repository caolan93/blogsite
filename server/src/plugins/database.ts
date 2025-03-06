import postgres from '@fastify/postgres';
import { FastifyInstance } from 'fastify';

const dbConnector = async (fastify: FastifyInstance) => {
	if (!process.env.POSTGRES_CONNECTION_STRING) {
		throw new Error('DATABASE_URL is not set');
	}

	await fastify.register(postgres, {
		connectionString: process.env.POSTGRES_CONNECTION_STRING,
	});
};

export default dbConnector;
