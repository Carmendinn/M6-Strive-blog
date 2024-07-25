import mongoose from "mongoose";

// Definisco lo schema per i commenti
const commentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Nome del commentatore, obbligatorio
        email: { type: String, required: true }, // Email del commentatore, obbligatoria
        content: { type: String, required: true } // Contenuto del commento, obbligatorio
    },
    {
        timestamps: true, // Aggiungo automaticamente i campi createdAt e updatedAt
        _id: true // Specifico che voglio un campo _id univoco per ogni commento
    }
);

// Definisco lo schema per i post del blog
const blogPostsSchema = new mongoose.Schema({
    category: { type: String, required: true }, // Categoria del post, obbligatoria
    title: { type: String, required: true }, // Titolo del post, obbligatorio
    cover: { type: String, required: true }, // URL dell'immagine di copertura, obbligatorio
    readTime: {
        value: { type: Number, required: true }, // Tempo di lettura in minuti, obbligatorio
        unit: { type: String, required: true } // Unità di tempo (ad esempio, "minuti"), obbligatoria
    },
    author: { type: String, required: true }, // Nome dell'autore, obbligatorio
    content: { type: String, required: true }, // Contenuto del post, obbligatorio
    comments: [commentSchema], // Array di commenti associati al post
}, {
    timestamps: true, // Aggiungo automaticamente i campi createdAt e updatedAt
    collection: "blogPosts" // Specifico il nome della collezione nel database
});

// Esporto il modello per poterlo utilizzare in altre parti dell'applicazione
export default mongoose.model("BlogPosts", blogPostsSchema);
