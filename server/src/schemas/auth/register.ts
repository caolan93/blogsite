import { FastifySchema } from 'fastify';

const registerResponseProperties = {
	message: { type: 'string' },
};

export const registerSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			firstName: 'string',
			lastName: 'string',
			email: 'string',
		},
		required: ['firstName', 'lastName', 'email'],
	},
	response: {
		201: {
			type: 'object',
			properties: registerResponseProperties,
		},
		500: {
			type: 'object',
			properties: registerResponseProperties,
		},
		400: {
			type: 'object',
			properties: registerResponseProperties,
		},
	},
};
