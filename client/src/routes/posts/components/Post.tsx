import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deletePost } from '../../../api/posts/delete.api';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import type { Post, PostList } from '../../../lib/types';
import PostForm from './PostForm';
import { getTimeString } from '../../../lib/utils';

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
		onSuccess: async () => {
			queryClient.setQueryData(['posts'], (old: PostList | undefined) => {
				if (!old) return { posts: [] };
				return {
					posts: old.posts,
				};
			});
			toast.success('Blog has been successfully deleted', {
				richColors: true,
			});
		},
		onError: (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
			toast.error('There was an error when deleting the blog post', {
				richColors: true,
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});
	return (
		<Card className='max-w-lg w-full'>
			<article className='flex flex-1 px-4 items-center'>
				<div className='flex flex-col w-full'>
					<p className='text-lg font-bold'>{post.title}</p>
					<p>Created at: {getTimeString(post.created_at)}</p>
				</div>
				<div className='flex gap-1.5'>
					<PostForm
						isEdit={true}
						id={post.id}
						prevTitle={post.title}
						prevPost={post.post}
					/>
					<Button onClick={() => deletePostFn(post.id)} variant={'destructive'}>
						Delete
					</Button>
				</div>
			</article>
		</Card>
	);
};

export default Post;
