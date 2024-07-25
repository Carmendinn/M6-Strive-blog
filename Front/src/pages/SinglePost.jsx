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
  const [editedCommentContent, setEditedCommentContent] = useState("");
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


  const fetchUpdatedComments = async () => {
    try {
      const updatedComments = await getComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error("Errore nel recupero dei commenti aggiornati:", error);
    }
  };

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
        email: userData.email, 
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
    // Verifica se l'utente è autenticato e ha i permessi per eliminare il commento
    if (!userData) {
      alert("Devi essere autenticato per eliminare un commento.");
      return;
    }

    const commentToDelete = comments.find(comment => comment._id === commentId);
    if (!commentToDelete || commentToDelete.email !== userData.email) {
      alert("Non hai i permessi per eliminare questo commento.");
      return;
    }

    if (window.confirm("Sei sicuro di voler eliminare questo commento?")) {
      try {
        await deleteComment(id, commentId);
        await fetchUpdatedComments();
      } catch (error) {
        console.error("Errore nell'eliminazione del commento:", error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        alert("Errore nell'eliminazione del commento: " + (error.response?.data?.message || error.message));
      }
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
  

  const handleEditComment = (commentId, content) => {
    setEditingComment(commentId);
    setEditedCommentContent(content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      await updateComment(id, commentId, { content: editedCommentContent });
      setEditingComment(null);
      await fetchUpdatedComments();
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
      alert("Errore nell'aggiornamento del commento");
    }
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
    
  }
};

  if (!post) return <div>Caricamento...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white shadow-md rounded-lg overflow-hidden">
        <header className="relative">
          <img src={post.cover} alt={post.title} className="w-full h-64 object-cover" />
          <div className="absolute top-0 left-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="text-sm">
              <span className="block">Categoria: {post.category}</span>
              <span className="block">Autore: {post.author}</span>
              <span className="block">Tempo di lettura: {post.readTime.value} {post.readTime.unit}</span>
            </div>
          </div>
        </header>

        <section className="p-4">
          <div
            className="post-text"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        <section className="p-4 border-t border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Commenti</h3>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-100 p-4 rounded-lg">
                  {editingCommentId === comment._id ? (
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={editedCommentContent}
                        onChange={(e) => setEditedCommentContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-2">
                        <button onClick={() => handleSaveEdit(comment._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Salva</button>
                        <button onClick={() => setEditingComment(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Annulla</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 mb-2">{comment.content}</p>
                      <div className="text-sm text-gray-600">
                        <small>Di: {comment.name}</small>
                        {userData && userData.email === comment.email && (
                          <div className="mt-2 flex space-x-2">
                            <button onClick={() => handleEditComment(comment._id, comment.content)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Modifica</button>
                            <button onClick={() => handleDeleteComment(comment._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Elimina</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Non ci sono ancora commenti per questo post.</p>
          )}
          {isLoggedIn && (
            <form onSubmit={handleCommentSubmit} className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Aggiungi un commento</h4>
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                placeholder="Scrivi il tuo commento..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Invia commento</button>
            </form>
          )}
        </section>
      </article>
    </div>
  );
};