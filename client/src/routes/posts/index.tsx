import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { getAllPosts } from '../../api/posts/getAll.api';
import type { PostList } from '../../lib/types';
import PostPageSkeleton from './components/PostPageSkeletonLoader';

const PostList = lazy(() => import('./components/PostList'));

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
			<section className='p-4 flex flex-col gap-2 items-center'>
				<p className='text-xl font-bold'>All Posts</p>
				<PostList posts={data?.posts} />
			</section>
		</Suspense>
	);
};

export default PostsPage;
