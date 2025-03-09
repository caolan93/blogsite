const PostPageSkeleton = () => {
	return (
		<section className='flex flex-col gap-2'>
			<div className='bg-gray-100 animate-pulse h-[101px] w-36 rounded-xl' />
			{Array.from({ length: 10 }).map((_, index) => (
				<div
					key={index}
					className='bg-gray-100 animate-pulse h-[101px] w-full rounded-xl'
				/>
			))}
		</section>
	);
};

export default PostPageSkeleton;
