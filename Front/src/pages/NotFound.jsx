import React from 'react';
import { Link } from "react-router-dom";

export default function NotFound({ searchTerm }) {
  return (
    <div className="container mx-auto mt-8 p-4 max-w-md text-center">
      <div className="bg-gray-100 rounded-lg shadow-lg p-6">
        <img
          src="https://img.freepik.com/free-vector/cute-sad-dog-sitting-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3743.jpg"
          alt="Sad puppy"
          className="w-48 h-48 mx-auto mb-6 rounded-full"
        />
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Nessun risultato trovato!</h2>
        <p className="mb-6 text-gray-600">
          Spiacenti, non abbiamo trovato risultati per "<span className="font-semibold">{searchTerm}</span>".
          Prova a cercare qualcos'altro o torna alla homepage.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-purple-800 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Homepage
          </Link>
          
        </div>
      </div>
    </div>
  );
};
