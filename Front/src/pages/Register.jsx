import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await registerUser(formData); 
      alert("Registrazione avvenuta con successo!"); 
      navigate("/login"); 
    } catch (error) {
      console.error("Errore durante la registrazione:", error); 
      alert("Errore durante la registrazione. Riprova."); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrati</h2>
        <form onSubmit={handleSubmit}>
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
          
          {avatarPreview && (
            <div className="mb-4">
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}

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