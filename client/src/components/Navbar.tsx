import { lazy, Suspense } from 'react';

const CreatePostForm = lazy(
	() => import('../routes/posts/components/CreatePostForm'),
);

const Navbar = () => {
	return (
		<nav className='flex justify-between shadow p-4'>
			<p className='text-3xl font-bold'>Blogsite</p>
			<Suspense
				fallback={
					<div className='w-[105px] h-[36px] animate-pulse bg-slate-200 rounded-xl' />
				}>
				<CreatePostForm />
			</Suspense>
		</nav>
	);
};

export default Navbar;
