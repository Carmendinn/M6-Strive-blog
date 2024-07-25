import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ posts }) {
  const [posts, setPosts] = useState([]);

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
  return (
    <div className="container mx-auto p-4 mt-5">
      <h1 className="text-3xl font-bold mb-4 mt-5 text-center">Adopt little friends for life</h1>
      <div className="post-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {posts.map(post => (
          <Link to={`/post/${post._id}`} key={post._id} className="post-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mt-5">
            <img src={post.cover} alt={post.title} className="post-image w-full h-48 object-cover" />
            <div className="post-content p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">Autore: {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}