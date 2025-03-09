import { FastifyInstance } from 'fastify';
import { createPostSchema } from '../../schemas/post/create.schema.js';
import { deletePostSchema } from '../../schemas/post/delete.schema.js';
import { editPostSchema } from '../../schemas/post/edit.schema.js';
import { postListSchema } from '../../schemas/post/getAll.schema.js';
import create from './create.route.js';
import deletePost from './delete.route.js';
import edit from './edit.js';
import getAll from './getAll.route.js';

const postRoutes = async (fastify: FastifyInstance) => {
	fastify.post('/create', { schema: createPostSchema }, create);
	fastify.get('/getAll', { schema: postListSchema }, getAll);
	fastify.delete('/delete/:id', { schema: deletePostSchema }, deletePost);
	fastify.patch('/edit/:id', { schema: editPostSchema }, edit);
};
export default postRoutes;
