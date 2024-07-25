import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import SinglePost from './pages/SinglePost';
import CreatePost from './pages/CreatePost';
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Search from './pages/Search';
import { getPosts } from './services/api';

function App() {
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Errore nel recupero dei post:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = posts.filter(post => {
      const title = post.title ? post.title.toLowerCase() : '';
      const author = post.author ? post.author.toLowerCase() : '';
      const searchLower = search.toLowerCase();
      return title.includes(searchLower) || author.includes(searchLower);
    });
    setFilteredPosts(filtered);
    setSearchSubmitted(true);
    setSearch('');
  };

  return (
    <Router>
      <div className="App bg-gray-300">
        <Navbar />
        <Search
          search={search}
          handleSearch={handleSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home posts={filteredPosts.length > 0 ? filteredPosts : posts} />} />
            <Route path="/create-post" element={<CreatePost onPostCreated={fetchPosts} />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route
              path="/search"
              element={
                searchSubmitted && filteredPosts.length === 0 ?
                <NotFound searchTerm={search} /> :
                <Navigate to="/" replace />
              }
            />
            <Route path="*" element={<NotFound searchTerm={search} />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
