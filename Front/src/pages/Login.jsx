import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";

  
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


export default function Login() {
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    email: "", // Campo per l'email
    password: "", // Campo per la password
  });

  const navigate = useNavigate(); // Hook per la navigazione programmatica
  const location = useLocation(); // Hook per ottenere le informazioni sulla posizione corrente

  // Effettua un controllo al caricamento del componente
  useEffect(() => {
    // Ottiene i parametri dalla query string dell'URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token"); // Estrae il token dalla query string

    if (token) {
      // Se esiste un token, memorizzalo nel localStorage
      localStorage.setItem("token", token);
      
      // Notifica ad altre parti dell'app che il token è stato salvato
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("loginStateChange"));
      
      // Naviga alla home page dopo aver salvato il token
      navigate("/");
    }
  }, [location, navigate]); // Dipendenze per il useEffect

  // Gestisce il cambiamento dei campi del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito di invio del form
    try {
      // Effettua la richiesta di login
      const response = await loginUser(formData);
      
      // Salva il token nel localStorage
      localStorage.setItem("token", response.token);
      
      // Notifica ad altre parti dell'app che il login è avvenuto
      window.dispatchEvent(new Event("storage"));
      
      console.log("Login effettuato con successo!");
      
      // Naviga alla home page dopo un login riuscito
      navigate("/");
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };

  // Gestisce il login con Google
  const handleGoogleLogin = () => {
    // Reindirizza l'utente al flusso di autenticazione di Google
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-md">
      {/* Titolo della pagina di login */}
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Login
      </h2>
      
      {/* Form di login */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {/* Campo per l'email */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>
        
        {/* Campo per la password */}
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>
        
        {/* Bottone per inviare il form */}
        <button
          type="submit"
          className="w-full bg-gray-700 text-white p-3 rounded hover:bg-gray-800 transition duration-300"
        >
          Accedi
        </button>
      </form>
      
      {/* Bottone per il login con Google */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
      >
        {/* Icona di Google */}
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Accedi con Google
      </button>
    </div>
  );
}