export const getAllPosts = async () => {
	const data = await fetch('http://localhost:3000/api/v1/post/getAll', {
		method: 'GET',
	});

	return await data.json();
};
