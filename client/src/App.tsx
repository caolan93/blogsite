import { FormEvent, useRef } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

const App = () => {
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			const form = new FormData(e.target as HTMLFormElement);
			const firstName = form.get('firstName');
			const lastName = form.get('lastName');
			const email = form.get('email');
			const data = await fetch('http://localhost:3000/api/v1/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
				}),
			});
			const res = await data.json();

			if (formRef.current) {
				formRef.current.reset();
			}
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section className='grid place-content-center h-screen'>
			<Card className='max-w-lg'>
				<h2 className='font-bold text-3xl text-center'>Register</h2>
				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className='flex flex-col justify-center items-center p-2 gap-3'
					action=''>
					<div className='grid grid-cols-2 gap-1.5 w-full'>
						<Input name='firstName' type='text' placeholder='First Name' />
						<Input name='lastName' type='text' placeholder='Last Name' />
					</div>
					<Input name='email' type='email' placeholder='Email' />
					<div className='flex gap-1'>
						<Button className='max-w-fit' variant={'default'}>
							Register
						</Button>
						<Button type='button' className='max-w-fit' variant={'link'}>
							Continue as a guest
						</Button>
					</div>
				</form>
			</Card>
		</section>
	);
};

export default App;
