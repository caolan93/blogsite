export const createPost = async (
	postTitle: string,
	postDesc: string,
): Promise<Array<{ id: number; title: string; post: string }> | null> => {
	try {
		const data = await fetch('http://localhost:3000/api/v1/post/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: postTitle,
				post: postDesc,
			}),
		});

		if (!data.ok) {
			throw new Error('There was an error');
		}

		return await data.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
