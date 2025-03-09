import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { createPost } from '../../../api/posts/create.api';
import { Button } from '../../../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import type { Post, PostList } from '../../../lib/types';

const CreatePostForm = () => {
	const queryClient = useQueryClient();
	const [post, setPost] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);

	const { mutate: createPostFn, isPending } = useMutation({
		mutationFn: async ({
			title: newTitle,
			post: newPost,
		}: {
			title: string;
			post: string;
		}) => {
			const response = await createPost(newTitle, newPost);

			if (!response || !response.post) {
				throw new Error('Failed to create post');
			}

			return response;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ['posts'],
			});
			const previousPosts = queryClient.getQueryData(['posts']);
			let tempId = Date.now();
			queryClient.setQueryData(['posts'], (old: { posts: Post[] }) => {
				if (!old) {
					return {
						posts: [
							{
								id: tempId,
								title,
								post,
							},
						],
					};
				}
				return {
					...old,
					posts: [
						...old.posts,
						{
							id: tempId,
							title,
							post,
						},
					],
				};
			});
			return { previousPosts, tempId };
		},
		onSuccess: (newPost: { message: string; post: Post }, _, context) => {
			queryClient.setQueryData(['posts'], (old: PostList | undefined) => {
				if (!old) return { posts: [newPost.post] };
				return {
					posts: old.posts.map((post) =>
						post.id === context.tempId ? newPost : post,
					),
				};
			});
			setOpen(false);
			toast.success('Blog has been successfully created', {
				richColors: true,
			});
		},
		onError: async (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
			toast.error('There was an error when creating the blog post', {
				richColors: true,
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			createPostFn({ title, post });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Post</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a post</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
					<Input
						name='title'
						type='text'
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Textarea
						name='post'
						placeholder={`What's going on?..`}
						rows={20}
						value={post}
						onChange={(e) => setPost(e.target.value)}
					/>
					<Button disabled={isPending}>Create Post</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreatePostForm;
