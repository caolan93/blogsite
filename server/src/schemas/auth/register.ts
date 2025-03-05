import { FastifySchema } from 'fastify';

const registerResponseProperties = {
	message: { type: 'string' },
	firstName: { type: 'string' },
	lastName: { type: 'string' },
	email: { type: 'string' },
};

export const registerSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			firstName: {
				type: 'string',
			},
			lastName: {
				type: 'string',
			},
			email: {
				type: 'string',
			},
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
