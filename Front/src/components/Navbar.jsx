import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { updateUserAvatar } from '../services/api'; 
import { getUserData } from '../services/api';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Token non valido:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();


    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStateChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    setIsLoggedIn(false);
    setUserName('');
    setAvatar(null);
    navigate('/');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await updateUserAvatar(formData);
        
        if (response.avatarUrl) {
          localStorage.setItem('userAvatar', response.avatarUrl);
          setAvatar(response.avatarUrl);
        }
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'avatar:', error);
        alert('Errore durante l\'aggiornamento dell\'avatar. Riprova.');
      }
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <a href="/" className="text-white text-lg font-bold">Hello.</a>
      <div className="flex items-center space-x-4 flex">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">Ciao, {userName || 'Utente'}</span>
            <Link to="/create" className="text-white hover:text-gray-200">Nuovo Post</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
            <Link to="/register" className="text-white hover:text-gray-200">Registrati</Link>
          </div>
        )}
      </div>
      {isLoggedIn && (
        <div className="relative flex items-center">
          <input
            type="file"
            id="avatar"
            className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-pointer"
            onChange={handleFileChange}
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