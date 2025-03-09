import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../../../api/posts/delete.api';
import type { Post, PostList } from '../../../lib/types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const Post = ({ post }: { post: Post }) => {
	const queryClient = useQueryClient();
	const { mutate: deletePostFn } = useMutation({
		mutationFn: async (id: number) => {
			return await deletePost(id);
		},
		onMutate: async (deletedPostId) => {
			await queryClient.cancelQueries({
				queryKey: ['posts'],
			});
			const previousPosts = queryClient.getQueryData(['posts']);
			queryClient.setQueryData(['posts'], (old: PostList) => {
				if (!old) return [];
				return {
					...old,
					posts: old.posts.filter((post) => post.id !== deletedPostId),
				};
			});
			return { previousPosts };
		},
		onError: (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
		},
	});
	return (
		<Card>
			<article key={post.id} className='flex flex-1 px-4 items-center'>
				<div className='flex flex-col w-full'>
					<p className='text-lg font-bold'>{post.title}</p>
					<p>Created at: {new Date().toLocaleDateString()}</p>
				</div>
				<Button onClick={() => deletePostFn(post.id)} variant={'destructive'}>
					Delete
				</Button>
			</article>
		</Card>
	);
};

export default Post;
