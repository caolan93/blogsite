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
import { editPost } from '../../../api/posts/edit.api';

const PostForm = ({
	isEdit = false,
	prevTitle,
	prevPost,
	id,
}: {
	isEdit?: boolean;
	prevTitle?: string;
	prevPost?: string;
	id?: number;
}) => {
	const queryClient = useQueryClient();
	const [post, setPost] = useState<string>(prevPost ?? '');
	const [title, setTitle] = useState<string>(prevTitle ?? '');
	const [open, setOpen] = useState<boolean>(false);

	const { mutate: submitPost, isPending: isSubmitting } = useMutation({
		mutationFn: async ({
			id,
			title: newTitle,
			post: newPost,
		}: {
			id?: number;
			title: string;
			post: string;
		}) => {
			if (isEdit) {
				const response = await editPost(id, newTitle, newPost);
				if (!response || !response.post) {
					throw new Error('Failed to update post');
				}
				return response;
			} else {
				const response = await createPost(newTitle, newPost);
				if (!response || !response.post) {
					throw new Error('Failed to create post');
				}
				return response;
			}
		},
		onMutate: async ({ id, title, post }) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] });
			const previousPosts = queryClient.getQueryData(['posts']);
			let tempId = isEdit ? id : Date.now();
			queryClient.setQueryData(['posts'], (old: PostList | undefined) => {
				const newPost = { id: tempId, title, post };
				if (!old) {
					return { posts: [newPost] };
				}
				return {
					posts: old.posts.map((p) => (p.id === tempId ? newPost : p)),
				};
			});
			return { previousPosts, tempId };
		},
		onSuccess: (newPost: { message: string; post: Post }, { id: tempId }) => {
			queryClient.setQueryData(['posts'], (old: PostList | undefined) => {
				if (!old) return { posts: [newPost.post] };
				return {
					posts: old.posts.map((post) =>
						post.id === tempId ? newPost.post : post,
					),
				};
			});
			setOpen(false);
			setPost('');
			setTitle('');
			toast.success(
				isEdit
					? 'Blog has been successfully updated'
					: 'Blog has been successfully created',
				{ richColors: true },
			);
		},
		onError: async (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
			toast.error(
				isEdit
					? 'There was an error when updating the blog post'
					: 'There was an error when creating the blog post',
				{ richColors: true },
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			submitPost({ id, title, post });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>{isEdit ? 'Edit' : 'Create Post'}</Button>
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
					<Button disabled={isSubmitting}>
						{isEdit ? 'Update Post' : 'Create Post'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default PostForm;
