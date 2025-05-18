import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import MainLayout from './components/MainLayout';
import CreateBlog from './components/CreateBlog';
import BlogDetailsPage from './components/BlogDetailsPage';
import MyBlogs from './components/MyBlogs';
import EditBlog from './components/EditBlog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;