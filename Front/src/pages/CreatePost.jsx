import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Chiamata alla funzione createPost
      await createPost(formData);

      // Reset del form
      setPost({
        title: "",
        category: "",
        content: "",
        readTime: { value: 0, unit: "minutes" },
        author: post.author,
      });

      // Navigazione alla home
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    } navigate("/");

  };

  return (
    <div className="container mx-auto max-w-lg p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Crea un nuovo post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titolo</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenuto</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700">URL Immagine</label>
          <input
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="readTimeValue" className="block text-sm font-medium text-gray-700">Tempo di lettura (minuti)</label>
          <input
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Email autore</label>
          <input
            type="email"
            id="author"
            name="author"
            value={post.author}
            readOnly
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full bg-gray-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Crea il post
        </button>
      </form>
    </div>
  );
}
