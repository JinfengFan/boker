import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Article from './pages/Article';
import Login from './pages/Login';
import Admin from './pages/admin/Admin';
import AdminArticles from './pages/admin/Articles';
import AdminCategories from './pages/admin/Categories';
import AdminComments from './pages/admin/Comments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="article/:id" element={<Article />} />
            <Route path="login" element={<Login />} />
            
            {/* 后台管理 */}
            <Route path="admin" element={<Admin />}>
              <Route index element={<AdminArticles />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="comments" element={<AdminComments />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
