import cors, { FastifyCorsOptions } from '@fastify/cors';

export const autoConfig: FastifyCorsOptions = {
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	origin: '*',
};

export default cors;
