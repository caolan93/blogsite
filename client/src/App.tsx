import { FormEvent } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

const App = () => {
	const handleSubmit = async (e: FormEvent) => {
		try {
			console.log('click');
			e.preventDefault();
			const data = await fetch('http://localhost:3000/api/v1/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log(data);
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
						<Input name='first-name' type='text' placeholder='First Name' />
						<Input name='last-name' type='text' placeholder='Last Name' />
					</div>
					<Input name='email' type='email' placeholder='Email' />
					<Button className='max-w-fit'>Register</Button>
				</form>
			</Card>
		</section>
	);
};

export default App;
