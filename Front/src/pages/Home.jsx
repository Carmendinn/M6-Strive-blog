import React from 'react'; // Importa la libreria React per creare componenti
import { Link } from 'react-router-dom'; // Importa Link per la navigazione tra pagine

// Definizione del componente Home che riceve una prop 'posts'
export default function Home({ posts }) {
  return (
    <div className="container mx-auto p-4 mt-5">
      {/* Intestazione principale della pagina */}
      <h1 className="text-3xl font-bold mb-4 mt-5 text-center">
        Adopt little friends for life
      </h1>
      
      {/* Sezione per la visualizzazione dei post in una griglia */}
      <div className="post-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {/* Mappatura attraverso l'array 'posts' per generare un link per ogni post */}
        {posts.map(post => (
          <Link 
            to={`/post/${post._id}`}  // Link alla pagina del post specifico usando l'ID del post
            key={post._id} // Chiave univoca per ogni post per aiutare React a gestire la lista
            className="post-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mt-5"
          >
            {/* Immagine del post */}
            <img 
              src={post.cover}  // URL dell'immagine del post
              alt={post.title}  // Testo alternativo per l'immagine, utile per l'accessibilità
              className="post-image w-full h-48 object-cover"
            />
            <div className="post-content p-4">
              {/* Titolo del post */}
              <h2 className="text-xl font-semibold">
                {post.title}
              </h2>
              {/* Autore del post */}
              <p className="text-gray-500 mt-2">
                Autore: {post.author}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
