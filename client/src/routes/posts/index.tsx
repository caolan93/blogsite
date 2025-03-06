import { FormEvent, useRef, useState } from 'react';
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
		</section>
	);
};

export default PostsPage;
