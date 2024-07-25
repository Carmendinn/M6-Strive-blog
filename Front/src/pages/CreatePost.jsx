import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";

export default function CreatePost() {
  // Inizializzo lo stato per i dati del post e il file dell'immagine di copertura
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();

  // Uso useEffect per recuperare i dati dell'utente al montaggio del componente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // Chiamo la funzione per ottenere i dati dell'utente
        const userData = await getMe();
        // Aggiorno lo stato del post con l'email dell'autore
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        // Se c'è un errore, navigo verso la pagina di login
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestisco i cambiamenti nei campi di input del modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se il campo modificato è il tempo di lettura, aggiorno il valore specifico
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Altrimenti aggiorno il campo corrispondente nel post
      setPost({ ...post, [name]: value });
    }
  };

  // Gestisco la selezione del file dell'immagine di copertura
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestisco l'invio del modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creo un oggetto FormData per inviare i dati del post e il file
      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiungo il file se è stato selezionato
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Chiamo la funzione per creare il post
      await createPost(formData);

      // Reset del modulo dopo la creazione del post
      setPost({
        title: "",
        category: "",
        content: "",
        readTime: { value: 0, unit: "minutes" },
        author: post.author,
      });

    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
    // Navigo verso la home page dopo l'invio del modulo
    navigate("/");
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
