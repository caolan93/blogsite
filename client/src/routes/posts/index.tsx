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
	return (
		<section>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Create Post</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create a post</DialogTitle>
					</DialogHeader>
					<form action='' className='flex flex-col gap-2'>
						<Input name='title' type='text' placeholder='Title' />
						<Textarea
							name='body'
							placeholder={`What's going on?..`}
							rows={20}
						/>
						<Button>Create Post</Button>
					</form>
				</DialogContent>
			</Dialog>
			<p>This is all the posts</p>
		</section>
	);
};

export default PostsPage;
