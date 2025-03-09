import { FastifySchema } from 'fastify';

const editPostResponseProperties = {
	message: { type: 'string' },
};

export const editPostSchema: FastifySchema = {
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
			properties: {
				message: { type: 'string' },
				post: {
					id: 'number',
					title: 'string',
					post: 'string',
					created_at: 'string',
				},
			},
		},
		400: {
			type: 'object',
			properties: editPostResponseProperties,
		},
		422: {
			type: 'object',
			properties: editPostResponseProperties,
		},
		500: {
			type: 'object',
			properties: editPostResponseProperties,
		},
	},
};
