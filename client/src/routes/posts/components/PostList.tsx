import type { Post as PostType } from '../../../lib/types';
import Post from './Post';

const PostList = ({ posts }: { posts: PostType[] | undefined }) => {
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

export default PostList;
