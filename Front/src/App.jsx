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
  // Stati per la ricerca e i post
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch dei post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data); // Imposta i post ottenuti nello stato
      } catch (error) {
        console.error('Errore nella fetch dei post:', error);
      }
    };
    fetchPosts();
  }, []); // L'effetto viene eseguito solo al montaggio del componente

  // Gestisce il cambiamento del valore della ricerca
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Gestisce l'invio del modulo di ricerca
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filtra i post in base alla ricerca
    const filtered = posts.filter(post => {
      const title = post.title ? post.title.toLowerCase() : '';
      const author = post.author ? post.author.toLowerCase() : '';
      const searchLower = search.toLowerCase();
      return title.includes(searchLower) || author.includes(searchLower);
    });
    setFilteredPosts(filtered); // Imposta i post filtrati nello stato
    setSearchSubmitted(true); // Indica che la ricerca è stata inviata
    setSearch(''); // Pulisce il campo di ricerca
  };

  return (
    <Router>
      <div className="App bg-gray-300">
        {/* Barra di navigazione */}
        <Navbar />

        {/* Componente di ricerca */}
        <Search
          search={search}
          handleSearch={handleSearch}
          handleSearchSubmit={handleSearchSubmit}
        />

        <main>
          <Routes>
            {/* Rotte per la registrazione e il login */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Rotta principale per la home page, mostra i post filtrati se disponibili */}
            <Route path="/" element={<Home posts={filteredPosts.length > 0 ? filteredPosts : posts} />} />

            {/* Rotta per la creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            {/* Rotta per un post specifico */}
            <Route path="/post/:id" element={<SinglePost />} />

            {/* Rotta per la ricerca, mostra NotFound se la ricerca non ha risultati */}
            <Route
              path="/search"
              element={
                searchSubmitted && filteredPosts.length === 0 ?
                <NotFound searchTerm={search} /> : // Mostra NotFound se non ci sono risultati
                <Navigate to="/" replace /> // Altrimenti, reindirizza alla home
              }
            />

            {/* Rotta per gestire tutte le altre rotte non definite */}
            <Route path="*" element={<NotFound searchTerm={search} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
export default App;