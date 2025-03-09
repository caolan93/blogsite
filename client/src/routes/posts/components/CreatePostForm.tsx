import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
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
	const [formData, setFormData] = useState<{
		postTitle: string;
		postDesc: string;
	}>({
		postTitle: '',
		postDesc: '',
	});

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
			setFormData((prevFormData) => ({
				...prevFormData,
				[e.target.name]: e.target.value,
			}));
		},
		[],
	);
	const [open, setOpen] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const {
		mutate: createPostFn,
		isPending,
		error,
	} = useMutation({
		mutationFn: async () => {
			const response = await createPost(formData.postTitle, formData.postDesc);

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
								title: formData.postTitle,
								post: formData.postDesc,
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
							title: formData.postTitle,
							post: formData.postDesc,
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
					posts: old.posts.filter((post) =>
						post.id === context.tempId ? newPost : post,
					),
				};
			});

			setOpen(false);
		},
		onError: async (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			createPostFn();
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
				{error && (
					<p className='text-red-500'>
						There was an error trying to create the post.
					</p>
				)}
				<DialogHeader>
					<DialogTitle>Create a post</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
					<Input
						name='title'
						type='text'
						placeholder='Title'
						onChange={(e) => handleChange(e)}
					/>
					<Textarea
						name='post'
						placeholder={`What's going on?..`}
						rows={20}
						onChange={(e) => handleChange(e)}
					/>
					<Button onClick={handleSubmit} disabled={isPending}>
						Create Post
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreatePostForm;
