export const deletePost = async (id: number) => {
	try {
		const data = await fetch(
			`http://localhost:3000/api/v1/post/delete/${String(id)}`,
			{
				method: 'DELETE',
			},
		);

		if (data.status !== 204) {
			const res = await data.json();
			return res.message;
		}

		return 'Post deleted successfully';
	} catch (error) {
		console.log(error);
	}
};
