import postgres, { PostgresDb } from '@fastify/postgres';
import { FastifyInstance } from 'fastify';

const dbConnector = async (fastify: FastifyInstance) => {
	try {
		if (!process.env.POSTGRES_CONNECTION_STRING) {
			throw new Error('POSTGRES_CONNECTION_STRING is not set');
		}

		await fastify.register(postgres, {
			connectionString: process.env.POSTGRES_CONNECTION_STRING,
		});

		fastify.decorate('db', fastify.pg);

		fastify.log.info('PostgreSQL database connection established.');
	} catch (error) {
		fastify.log.error('Error connecting to PostgreSQL:', error);
		throw error;
	}
};

export default dbConnector;
