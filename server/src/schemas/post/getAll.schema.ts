import { FastifySchema } from 'fastify';

export const postListSchema: FastifySchema = {
	response: {
		204: {
			type: 'object',
			properties: {
				data: {
					type: 'object',
					message: 'string',
				},
			},
		},
		404: {
			type: 'object',
			properties: {
				data: {
					type: 'object',
					message: 'string',
				},
			},
		},
	},
};
