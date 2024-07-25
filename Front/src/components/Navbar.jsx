import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { updateUserAvatar } from '../services/api'; 
import { getUserData } from '../services/api';

export default function Navbar() {
  // Dichiarazione degli stati del componente
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per verificare se l'utente è loggato
  const [userName, setUserName] = useState(''); // Stato per memorizzare il nome dell'utente
  const [avatar, setAvatar] = useState(null); // Stato per memorizzare l'avatar dell'utente
  const navigate = useNavigate(); // Hook per navigare tra le pagine

  // Effetto per controllare lo stato di login al montaggio del componente
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token"); // Ottengo il token dall'archivio locale
      if (token) {
        try {
          const userData = await getUserData(); // Recupero i dati dell'utente
          setIsLoggedIn(true); // Imposto lo stato di login
          setUserName(userData.nome); // Imposto il nome dell'utente
          setAvatar(userData.avatar); // Imposto l'avatar dell'utente
        } catch (error) {
          console.error("Token non valido:", error); // Stampo l'errore se il token non è valido
          localStorage.removeItem("token"); // Rimuovo il token non valido
          setIsLoggedIn(false); // Imposto lo stato di login a falso
        }
      } else {
        setIsLoggedIn(false); // Se non c'è token, l'utente non è loggato
      }
    };
  
    checkLoginStatus(); // Chiamo la funzione per controllare lo stato di login
    
    // Aggiungo gli event listener per aggiornare lo stato di login
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStateChange", checkLoginStatus);
  
    return () => {
      // Rimuovo gli event listener quando il componente viene smontato
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);
  
  // Funzione per gestire il login
  const handleLogin = async (loginData) => {
    try {
      const response = await loginUser(loginData); // Eseguo la chiamata per il login
      localStorage.setItem('token', response.token); // Salvo il token nell'archivio locale
      window.dispatchEvent(new Event('loginStateChange')); // Dispatch l'evento di cambiamento stato login
    } catch (error) {
      console.error('Errore durante il login:', error); // Stampo l'errore in caso di problemi
    }
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuovo il token dall'archivio locale
    localStorage.removeItem('userName'); // Rimuovo il nome utente
    localStorage.removeItem('userAvatar'); // Rimuovo l'avatar dell'utente
    setIsLoggedIn(false); // Imposto lo stato di login a falso
    setUserName(''); // Resetta il nome utente
    setAvatar(null); // Resetta l'avatar
    navigate('/'); // Navigo alla home page
  };

  // Funzione per gestire il cambiamento del file dell'avatar
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Ottengo il file selezionato
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file); // Aggiungo il file al form data

        const response = await updateUserAvatar(formData); // Chiamo l'API per aggiornare l'avatar
        
        if (response.avatarUrl) {
          localStorage.setItem('userAvatar', response.avatarUrl); // Salvo il nuovo URL dell'avatar
          setAvatar(response.avatarUrl); // Aggiorno l'avatar nello stato
        }
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'avatar:', error); // Stampo l'errore in caso di problemi
        alert('Errore durante l\'aggiornamento dell\'avatar. Riprova.'); // Mostro un messaggio di errore all'utente
      }
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <a href="/" className="text-white text-lg font-bold">Hello.</a>
      <div className="flex items-center space-x-4 flex">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">Ciao, {userName || 'Utente'}</span> {/* Mostra il nome utente */}
            <Link to="/create" className="text-white hover:text-gray-200">Nuovo Post</Link> {/* Link per creare un nuovo post */}
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button> {/* Pulsante per il logout */}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-gray-200">Login</Link> {/* Link per il login */}
            <Link to="/register" className="text-white hover:text-gray-200">Registrati</Link> {/* Link per la registrazione */}
          </div>
        )}
      </div>
      {isLoggedIn && (
        <div className="relative flex items-center">
          <input
            type="file"
            id="avatar"
            className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-pointer"
            onChange={handleFileChange} // Gestisco il cambiamento del file
          />
          <img
            src={avatar || "https://via.placeholder.com/48"}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-white shadow-md mr-2 object-cover"
          />
          <label htmlFor="avatar" className="cursor-pointer">
            <FaArrowRight className="text-white text-xl hover:text-gray-300" />
          </label>
        </div>
      )}
    </nav>
  );
}
