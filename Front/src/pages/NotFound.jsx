import React from 'react';
import { Link } from "react-router-dom";

export default function NotFound({ searchTerm }) {
  return (
    <div className="container mx-auto mt-8 p-4 max-w-md text-center">
      {/* Contenitore principale per la pagina di errore */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-6">
        {/* Immagine rappresentativa di un cucciolo triste */}
        <img
          src="https://img.freepik.com/free-vector/cute-sad-dog-sitting-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3743.jpg"
          alt="Sad puppy" // Descrizione per l'immagine
          className="w-48 h-48 mx-auto mb-6 rounded-full" // Classi per lo stile dell'immagine
        />
        
        {/* Titolo della pagina di errore */}
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Nessun risultato trovato!</h2>
        
        {/* Messaggio di errore che include il termine di ricerca */}
        <p className="mb-6 text-gray-600">
          Spiacenti, non abbiamo trovato risultati per "<span className="font-semibold">{searchTerm}</span>".
          Prova a cercare qualcos'altro o torna alla homepage.
        </p>
        
        {/* Bottone per tornare alla homepage */}
        <div className="flex justify-center space-x-4">
          <Link
            to="/" // URL della homepage
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-purple-800 transition duration-300 shadow-lg transform hover:scale-105"
            // Classi per lo stile del bottone, incluso gradiente, hover e trasformazione
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
