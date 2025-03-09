import { BrowserRouter, Route, Routes } from 'react-router';
import PostsPage from './routes/posts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Navbar from './components/Navbar';
import { Toaster } from 'sonner';

const App = () => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path='/' element={<PostsPage />} />
				</Routes>
				<Toaster />
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
