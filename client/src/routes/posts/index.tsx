import { FormEvent, useEffect, useRef, useState } from 'react';
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

const PostsPage = () => {
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDesc, setPostDesc] = useState<string>('');
	const [posts, setPosts] = useState<
		Array<{ title: string; post: string; id: number }>
	>([]);
	const [response, setResponse] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDivElement | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			const data = await fetch('http://localhost:3000/api/v1/post/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: postTitle,
					post: postDesc,
				}),
			});

			if (!data.ok) {
				throw new Error('There was an error');
			}

			const res = await data.json();
			setResponse(res.message);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchPosts = async () => {
		const data = await fetch('http://localhost:3000/api/v1/post/getAll', {
			method: 'GET',
		});

		const res = await data.json();
		console.log('res', res);
		setPosts(res.posts);
	};

	const deletePost = async (id: number) => {
		try {
			const data = await fetch(
				`http://localhost:3000/api/v1/post/delete/${String(id)}`,
				{
					method: 'DELETE',
				},
			);

			if (data.status !== 204) {
				const res = await data.json();
				return setResponse(res.message);
			}

			return setResponse('Post deleted successfully');
		} catch (error) {
			console.log(error);
		}
	};

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
						<Button>Create Post</Button>
					</form>
				</DialogContent>
			</Dialog>

			<div>
				<Button onClick={fetchPosts}>Fetch Posts</Button>
				{posts?.length > 0 &&
					posts?.map((post) => (
						<article key={post.id} className='flex flex-col'>
							<p>{post.title}</p>
							<p>{post.post}</p>
							<Button
								onClick={() => deletePost(post.id)}
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
