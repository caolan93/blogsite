import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { getAllPosts } from '../../api/posts/getAll.api';
import type { PostList } from '../../lib/types';
import PostPageSkeleton from './components/PostPageSkeletonLoader';

const PostList = lazy(() => import('./components/PostList'));
const CreatePostForm = lazy(() => import('./components/CreatePostForm'));

const PostsPage = () => {
	const { data, isLoading } = useQuery<PostList>({
		queryKey: ['posts'],
		queryFn: async () => {
			return await getAllPosts();
		},
	});

	if (isLoading) {
		return <PostPageSkeleton />;
	}

	return (
		<Suspense fallback={<PostPageSkeleton />}>
			<section>
				<CreatePostForm />
				<PostList posts={data?.posts} />
			</section>
		</Suspense>
	);
};

export default PostsPage;
