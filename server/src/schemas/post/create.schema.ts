import { FastifySchema } from 'fastify';

const createPostResponseProperties = {
	message: { type: 'string' },
};

export const createPostSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			title: {
				type: 'string',
			},
			post: {
				type: 'string',
			},
		},
		required: ['title', 'post'],
	},
	response: {
		201: {
			type: 'object',
			properties: createPostResponseProperties,
		},
		400: {
			type: 'object',
			properties: createPostResponseProperties,
		},
		422: {
			type: 'object',
			properties: createPostResponseProperties,
		},
		500: {
			type: 'object',
			properties: createPostResponseProperties,
		},
	},
};
