import { FastifyInstance } from 'fastify';
import create from './create.route.js';
import { createPostSchema } from '../../schemas/post/create.schema.js';

const postRoutes = async (fastify: FastifyInstance) => {
	fastify.post('/create', { schema: createPostSchema }, create);
};
export default postRoutes;
