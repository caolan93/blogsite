import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';
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
import { createPost } from '../../api/posts/create.api';

const PostsPage = () => {
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDesc, setPostDesc] = useState<string>('');
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<{
		posts: Array<{ title: string; post: string; id: number }>;
	}>({
		queryKey: ['posts'],
		queryFn: async () => {
			return await getAllPosts();
		},
	});

	const { mutate: deletePostFn } = useMutation({
		mutationFn: async (id: number) => {
			return await deletePost(id);
		},
		onMutate: async (deletedPostId) => {
			await queryClient.cancelQueries({
				queryKey: ['posts'],
			});

			const previousPosts = queryClient.getQueryData(['posts']);

			queryClient.setQueryData(
				['posts'],
				(old: {
					posts: Array<{ title: string; post: string; id: number }>;
				}) => {
					if (!old) return [];
					return {
						...old,
						data: old.posts.filter((post) => post.id !== deletedPostId),
					};
				},
			);

			// Return a context object with the snapshotted value
			return { previousPosts };
		},
	});
	const { mutate: createPostFn } = useMutation({
		mutationFn: async () => {
			await createPost(postTitle, postDesc);
		},
		onSuccess: () => {
			setResponse('Your post was created successfully');
		},
		onError: () => {
			setResponse('There was an error creating post');
		},
	});
	const [response, setResponse] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDivElement | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return <p>is loading</p>;
	}

	return (
		<section>
			{response && (
				<div>
					<p>{response}</p>
				</div>
			)}
			<Dialog>
				<DialogTrigger asChild>
					<Button>Create Post</Button>
				</DialogTrigger>
				<DialogContent ref={dialogRef}>
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
						<Button onClick={() => createPostFn()}>Create Post</Button>
					</form>
				</DialogContent>
			</Dialog>

			<div>
				{data?.posts &&
					data?.posts?.length > 0 &&
					data?.posts?.map((post) => (
						<article key={post.id} className='flex flex-col'>
							<p>{post.title}</p>
							<p>{post.post}</p>
							<Button
								onClick={() => deletePostFn(post.id)}
								variant={'destructive'}>
								Delete
							</Button>
						</article>
					))}
			</div>
		</section>
	);
};

export default PostsPage;
