export type Post = {
	id: number;
	title: string;
	post: string;
	created_at: string;
};

export type PostList = {
	posts: Post[];
};
