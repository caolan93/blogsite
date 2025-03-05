import { BrowserRouter, Route, Routes } from 'react-router';
import AuthRoute from './routes/auth';
import PostsPage from './routes/posts';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthRoute />} />
				<Route path='/posts' element={<PostsPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
