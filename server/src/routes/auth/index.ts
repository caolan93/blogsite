import { FastifyInstance } from 'fastify';
import register from './register.route.js';
import { registerSchema } from '../../schemas/auth/register.js';

const authRoutes = (fastify: FastifyInstance) => {
	fastify.post('/register', { schema: registerSchema }, register);
};
export default authRoutes;
