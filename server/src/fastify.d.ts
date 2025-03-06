import { FastifyInstance } from 'fastify';
import { PostgresDb } from '@fastify/postgres';

declare module 'fastify' {
	interface FastifyInstance {
		db: PostgresDb;
	}
}
