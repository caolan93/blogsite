import { Post } from '../../lib/types';

export const editPost = async (
	id?: number,
	postTitle?: string,
	postDesc?: string,
): Promise<{ message: string; post: Post } | undefined> => {
	if (!id) {
		throw new Error('There was no id passed');
	}

	let body: Record<string, string | number> = {
		id,
	};

	if (postTitle) {
		body.title = postTitle;
	}
	if (postDesc) {
		body.post = postDesc;
	}

	try {
		const data = await fetch(`http://localhost:3000/api/v1/post/edit/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!data.ok) {
			throw new Error('There was an error');
		}

		return await data.json();
	} catch (error) {
		console.error(error);
		return undefined;
	}
};
