import { FastifyInstance } from 'fastify';
import register from './register.route.ts';
import { registerSchema } from '../../schemas/auth/register.ts';

const authRoutes = (fastify: FastifyInstance) => {
	fastify.post('/register', { schema: registerSchema }, register);
};
export default authRoutes;
