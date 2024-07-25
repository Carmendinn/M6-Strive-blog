import axios from "axios";


//const API_URL = "http://localhost:5001/api";
const API_URL = "https://m6-strive-blog.onrender.com/api";

// Crea un'istanza di Axios con l'URL di base configurato
const api = axios.create({
  baseURL: API_URL,
});

// Intercettore per gestire le richieste HTTP
api.interceptors.request.use(
  (config) => {
    // Recupera il token di autenticazione dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD sui post
export const getPosts = () => api.get("/blogPosts"); // Ottiene tutti i post
export const getPost = (id) => api.get(`/blogPosts/${id}`); // Ottiene un singolo post per ID
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data", // Specifica il tipo di contenuto per il caricamento di file
    },
  }); // Crea un nuovo post
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData); // Aggiorna un post esistente
export const deletePost = (id) => api.delete(`/blogPosts/${id}`); // Elimina un post esistente

// Funzioni per la gestione dei commenti sui post
export const getComments = (postId) =>
  api.get(`/blogPosts/${postId}/comments`).then((response) => response.data); // Ottiene tutti i commenti per un post

export const addComment = (postId, commentData) =>
  api
    .post(`/blogPosts/${postId}/comments`, commentData)
    .then((response) => response.data); // Aggiunge un nuovo commento a un post

export const getComment = (postId, commentId) =>
  api
    .get(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data); // Ottiene un commento specifico per ID

export const updateComment = async (postId, commentId, commentData) => {
  try {
    // Aggiorna un commento esistente
    const response = await api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del commento:", error);
    throw error; // Rilancia l'errore per gestirlo a monte
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    // Elimina un commento esistente
    const response = await api.delete(`/blogPosts/${postId}/comments/${commentId}`);
    console.log("Risposta API:", response.data); // Log della risposta per debugging
    return response.data;
  } catch (error) {
    console.error("Errore nella cancellazione del commento:", error);
    throw error; // Rilancia l'errore per gestirlo a monte
  }
};

// Funzioni per la gestione degli utenti
export const registerUser = (userData) => api.post("/authors", userData); // Registra un nuovo utente

export const loginUser = async (credentials) => {
  try {
    // Effettua la richiesta di login e restituisce i dati della risposta
    const response = await api.post("/auth/login", credentials);
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data;
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error);
    throw error; // Rilancia l'errore per gestirlo a monte
  }
};

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getUserData = async () => {
  try {
    // Recupera i dati dell'utente autenticato
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dei dati utente:', error);
    throw error; // Rilancia l'errore per gestirlo a monte
  }
};

// Funzione per aggiornare l'avatar dell'utente
export const updateUserAvatar = async (formData) => {
  const token = localStorage.getItem('token'); // Recupera il token dalla memoria locale
  try {
    // Effettua una richiesta per aggiornare l'avatar dell'utente
    const response = await axios.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // Include il token di autorizzazione
      }
    });
    return response.data;
  } catch (error) {
    throw error; // Rilancia l'errore per gestirlo a monte
  }
};