import axios from "axios";


//const API_URL = "http://localhost:5001/api";
const API_URL = "https://m6-strive-blog.onrender.com";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});



api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD sui post
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);



export const getComments = (postId) =>
  api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);

// Funzione per aggiungere un commento a un post
export const addComment = (postId, commentData) =>
  api
    .post(`/blogPosts/${postId}/comments`, commentData)
    .then((response) => response.data);


export const getComment = (postId, commentId) =>
  api
    .get(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data);

// Funzione per aggiornare un commento tramite l'ID del post e l'ID del commento
export const updateComment = async (postId, commentId, commentData) => {
  try {
    const response = await api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del commento:", error);
    throw error;
  }
};

// Funzione per eliminare un commento tramite l'ID del post e l'ID del commento
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await api
      .delete(`/blogPosts/${postId}/comments/${commentId}`);
    console.log("Risposta API:", response.data); // Puoi loggare la risposta per debug
    return response.data;
  } catch (error) {
    console.error("Errore nella cancellazione del commento:", error);
    throw error; // Rilancia l'errore per gestirlo più a monte, se necessario
  }
};


//  Funzione per registrare un nuovo utente
export const registerUser = (userData) => api.post("/authors", userData);

    export const loginUser = async (credentials) => {
      try {
        const response = await api.post("/auth/login", credentials); 
        console.log("Risposta API login:", response.data); 
        return response.data; 
      } catch (error) {
        console.error("Errore nella chiamata API di login:", error); 
        throw error; 
      }
    };
    
    //  Funzione per ottenere i dati dell'utente attualmente autenticato
    export const getMe = () =>
      api.get("/auth/me").then((response) => response.data);


    export const updateUserAvatar = async (formData) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('/api/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
    
    // Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
    export const getUserData = async () => {
      try {
        const response = await api.get('/auth/me'); // Effettua la richiesta per ottenere i dati dell'utente
        return response.data; // Restituisce i dati della risposta
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error); // Log dell'errore per debugging
        throw error; // Lancia l'errore per essere gestito dal chiamante
      }
    };

export default api;