import cors, { FastifyCorsOptions } from '@fastify/cors';

export const autoConfig: FastifyCorsOptions = {
	methods: ['GET', 'POST', 'DELETE'],
	origin: '*',
};

export default cors;
