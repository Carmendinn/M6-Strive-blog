import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, getComments, addComment, getUserData, deletePost, deleteComment, updatePost, updateComment } from "../services/api";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const data = await getUserData();
          setUserData(data);
          fetchComments();
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchPost();
    checkAuthAndFetchUserData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per commentare.");
      return;
    }
    try {
      const commentData = {
        content: newComment.content,
        name: `${userData.nome} ${userData.cognome}`,
        email: userData.email, // Assicurati che l'email sia qui
      };
      const newCommentData = await addComment(id, commentData);
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment({ content: "" });
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
      alert(`Errore nell'invio del commento: ${error.response?.data?.message || error.message}`);
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    console.log("ID del commento da eliminare:", commentId); // Verifica l'ID del commento prima di procedere
    try {
      await deleteComment(id, commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Errore nella cancellazione del commento:", error);
    }
  };
  
  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('Errore nella cancellazione del post:', error);
    }
  };
  

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setNewComment({ content: comment.content });
  };

  
  
  const handleEditPost = () => {
    setEditingPost(true);
  };

  const handleEditPostSubmit = async (e) => {
  e.preventDefault();
  if (!isLoggedIn || !post) {
    console.error('Utente non autorizzato o post non valido.');

    return;
  }
  try {
    const updatedPostData = {
      ...post,
      content: post.content,
    };
    await updatePost(id, updatedPostData);
    setPost(updatedPostData);
    setEditingPost(false);
  } catch (error) {
    console.error("Errore nell'aggiornamento del post:", error);
    // Aggiungi gestione dell'errore, ad esempio:
    // alert(`Errore nell'aggiornamento del post: ${error.message}`);
  }
};

  if (!post) return <div>Caricamento...</div>;

  return (
  <div className="container mx-auto p-4">
    <article className="bg-white rounded-lg shadow-md p-6">
      <img
        src={post.cover}
        alt={post.title}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        <span className="block">Categoria: {post.category}</span>
        <span className="block">Autore: {post.author}</span>
        <span className="block">
          Tempo di lettura: {post.readTime.value} {post.readTime.unit}
        </span>
      </div>
      <div
        className="text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {isLoggedIn && (
        <div className="mt-4">
          <button
            onClick={handleEditPost}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Modifica Post
          </button>
          <button
            onClick={handleDeletePost}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Elimina Post
          </button>
        </div>
      )}
      {editingPost && (
        <form onSubmit={handleEditPostSubmit} className="mt-4">
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            rows="6"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Salva Modifiche
          </button>
        </form>
      )}
      <h3 className="text-2xl font-semibold mt-8 mb-4">Commenti</h3>
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <p className="text-gray-800">{comment.content}</p>
          <small className="text-gray-600">Di: {comment.name}</small> {/* Visualizza il nome e l'email */}
          {isLoggedIn && (
            <div className="mt-2">
              <button
                onClick={() => handleEditComment(comment)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Modifica
              </button>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Elimina
              </button>
            </div>
          )}
        </div>
      ))}
      {isLoggedIn ? (
        <form
          onSubmit={editingComment ? handleCommentSubmit : handleCommentSubmit}
          className="mt-4"
        >
          <textarea
            value={newComment.content}
            onChange={(e) => setNewComment({ content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            placeholder="Scrivi un commento..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            {editingComment ? "Salva Modifiche" : "Aggiungi Commento"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-red-500">Effettua il login per lasciare un commento.</p>
      )}
    </article>
  </div>
  );
}
