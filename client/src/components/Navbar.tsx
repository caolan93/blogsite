import { lazy, Suspense } from 'react';

const CreatePostForm = lazy(
	() => import('../routes/posts/components/PostForm'),
);

const Navbar = () => {
	return (
		<div className='p-4 shadow flex justify-center'>
			<div className='max-w-7xl w-full flex justify-between'>
				<p className='text-3xl font-bold'>Blogsite</p>
				<Suspense
					fallback={
						<div className='w-[105px] h-[36px] animate-pulse bg-slate-200 rounded-xl' />
					}>
					<CreatePostForm />
				</Suspense>
			</div>
		</div>
	);
};

export default Navbar;
