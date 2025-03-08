import { BrowserRouter, Route, Routes } from 'react-router';
import AuthRoute from './routes/auth';
import PostsPage from './routes/posts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const App = () => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<AuthRoute />} />
					<Route path='/posts' element={<PostsPage />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
