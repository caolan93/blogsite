import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { createPost } from '../../api/posts/create.api';
import { deletePost } from '../../api/posts/delete.api';
import { getAllPosts } from '../../api/posts/getAll.api';
import { Button } from '../../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import type { Post, PostList } from '../../lib/types';
import { Card } from '../../components/ui/card';

const PostsPage = () => {
	const { data, isLoading } = useQuery<PostList>({
		queryKey: ['posts'],
		queryFn: async () => {
			return await getAllPosts();
		},
	});

	if (isLoading) {
		return (
			<section className='flex flex-col gap-2'>
				{Array.from({ length: 10 }).map((_, index) => (
					<div
						key={index}
						className='bg-gray-100 animate-pulse h-[101px] w-full rounded-xl'
					/>
				))}
			</section>
		);
	}

	return (
		<section>
			<CreatePostForm />
			<PostList posts={data?.posts} />
		</section>
	);
};

export default PostsPage;

const CreatePostForm = () => {
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDesc, setPostDesc] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const {
		mutate: createPostFn,
		isPending,
		error,
	} = useMutation({
		mutationFn: async () => {
			const response = await createPost(postTitle, postDesc);

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
			queryClient.setQueryData(['posts'], (old: { posts: Post[] }) => {
				if (!old) {
					return {
						posts: [
							{
								id: 1,
								title: postTitle,
								post: postDesc,
							},
						],
					};
				}
				return {
					...old,
					posts: [
						{
							id: new Date().getTime(),
							title: postTitle,
							post: postDesc,
						},
						...old.posts,
					],
				};
			});
			return { previousPosts };
		},
		onSuccess: (newPost: { message: string; post: Post }) => {
			queryClient.setQueryData(['posts'], (old: PostList | undefined) => {
				if (!old) return { posts: [newPost.post] };
				return { posts: [newPost.post, ...old.posts] };
			});

			setOpen(false);
			setPostDesc('');
			setPostTitle('');
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
						value={postTitle}
						onChange={(e) => setPostTitle(e.target.value)}
					/>
					<Textarea
						name='post'
						placeholder={`What's going on?..`}
						rows={20}
						value={postDesc}
						onChange={(e) => setPostDesc(e.target.value)}
					/>
					<Button onClick={handleSubmit} disabled={isPending}>
						Create Post
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const PostList = ({ posts }: { posts: Post[] | undefined }) => {
	if (!posts || posts.length <= 0) {
		return (
			<section>
				<p>There are no posts to display.</p>
			</section>
		);
	}

	return (
		<section className='flex flex-col gap-2'>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</section>
	);
};

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
