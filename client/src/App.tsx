import { FormEvent } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

const App = () => {
	const handleSubmit = async (e: FormEvent) => {
		try {
			console.log('click');
			e.preventDefault();
			const form = new FormData(e.target as HTMLFormElement);

			const firstName = form.get('first-name');
			const lastName = form.get('last-name');
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
					onSubmit={handleSubmit}
					className='flex flex-col justify-center items-center p-2 gap-3'
					action=''>
					<div className='grid grid-cols-2 gap-1.5 w-full'>
						<Input name='firstName' type='text' placeholder='First Name' />
						<Input name='lastName' type='text' placeholder='Last Name' />
					</div>
					<Input name='email' type='email' placeholder='Email' />
					<Button className='max-w-fit'>Register</Button>
				</form>
			</Card>
		</section>
	);
};

export default App;
