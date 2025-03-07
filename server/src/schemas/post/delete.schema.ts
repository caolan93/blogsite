import { FastifySchema } from 'fastify';

const deletePostResponseProperties = {
	message: { type: 'string' },
};

export const deletePostSchema: FastifySchema = {
	response: {
		204: {
			type: 'null',
		},
		404: {
			type: 'object',
			properties: deletePostResponseProperties,
		},
	},
};
