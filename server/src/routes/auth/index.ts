import { FastifyInstance } from 'fastify';
import register from './register.route.js';
import { registerSchema } from '../../schemas/auth/register.js';
import test from './test.route.js';

const authRoutes = async (fastify: FastifyInstance) => {
	fastify.post('/register', { schema: registerSchema }, register);
	fastify.get('/test', test);
};
export default authRoutes;
