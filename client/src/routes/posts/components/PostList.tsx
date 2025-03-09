import type { Post as PostType } from '../../../lib/types';
import Post from './Post';

const PostList = ({ posts }: { posts: PostType[] | undefined }) => {
	if (!posts || posts.length <= 0) {
		return <p>There are no posts to display.</p>;
	}

	return posts.map((post) => <Post key={post.id} post={post} />);
};

export default PostList;
