import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  // Stato per i dati del modulo e l'anteprima dell'avatar
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null); // Stato per l'anteprima dell'avatar

  const navigate = useNavigate(); // Hook per la navigazione

  // Gestisce le modifiche ai campi del modulo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestisce la selezione dell'avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Ottiene il file selezionato
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file)); // Crea un URL temporaneo per l'anteprima
    }
  };

  // Gestisce l'invio del modulo
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito di invio del modulo
    try {
      await registerUser(formData); // Chiama la funzione di registrazione utente
      alert("Registrazione avvenuta con successo!"); // Notifica di successo
      navigate("/login"); // Reindirizza alla pagina di login
    } catch (error) {
      console.error("Errore durante la registrazione:", error); // Log dell'errore
      alert("Errore durante la registrazione. Riprova."); // Notifica di errore
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrati</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Campo Cognome */}
          <div className="mb-4">
            <label className="block text-gray-700">Cognome</label>
            <input
              type="text"
              name="cognome"
              placeholder="Cognome"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Campo Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Campo Password */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Campo Data di Nascita */}
          <div className="mb-4">
            <label className="block text-gray-700">Data di Nascita</label>
            <input
              type="date"
              name="dataDiNascita"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Campo Avatar */}
          <div className="mb-4">
            <label className="block text-gray-700">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Anteprima dell'avatar */}
          {avatarPreview && (
            <div className="mb-4">
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}

          {/* Bottone di Registrazione */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrati
          </button>
        </form>
      </div>
    </div>
  );
}