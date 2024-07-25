import express from "express";
import Authors from "../models/Authors.js";
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";

const router = express.Router();

// GET /authors: Ottieni tutti gli autori
router.get('/', async (req, res) => {
    try {
        // Cerco tutti gli autori nel database
        const authors = await Authors.find();
        // Rispondo con la lista degli autori
        res.json(authors);
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// GET /authors/:id: Ottieni un autore specifico per ID
router.get('/:id', async (req, res) => {
    try {
        // Cerco l'autore per ID
        const author = await Authors.findById(req.params.id);
        if (!author) {
            // Se l'autore non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        // Rispondo con i dettagli dell'autore
        res.json(author);
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// POST /authors: Crea un nuovo autore
router.post('/', async (req, res) => {
    // Creo una nuova istanza di autore con i dati inviati nella richiesta
    const author = new Authors(req.body);
    try {
        // Salvo il nuovo autore nel database
        const newAuthor = await author.save();
        // Converto l'autore in un oggetto JavaScript
        const authorResponse = newAuthor.toObject();
        // Rimuovo la password dalla risposta per motivi di sicurezza
        delete authorResponse.password;
        // Rispondo con l'autore creato e stato 201 (Creato)
        res.status(201).json(authorResponse);
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 400
        res.status(400).json({ message: err.message });
    }
});

// PUT /authors/:id: Modifica un autore esistente per ID
router.put('/:id', async (req, res) => {
    try {
        // Trovo e aggiorno l'autore per ID
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Restituisco il documento aggiornato
        );
        if (!updateAuthor) {
            // Se l'autore non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        // Rispondo con l'autore aggiornato
        res.json(updateAuthor);
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 400
        res.status(400).json({ message: err.message });
    }
});

// DELETE /authors/:id: Elimina un autore esistente per ID
router.delete('/:id', async (req, res) => {
    try {
        // Trovo e elimino l'autore per ID
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            // Se l'autore non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        // Rispondo con un messaggio di successo
        res.json({ message: 'Autore eliminato' });
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// GET /authors/:id/blogPosts: Ottieni tutti i blog post di uno specifico autore
router.get('/:id/blogPosts', async (req, res) => {
    try {
        // Trovo l'autore per ID
        const author = await Authors.findById(req.params.id);
        if (!author) {
            // Se l'autore non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        // Trovo tutti i post del blog scritti da questo autore (utilizzo l'email dell'autore per filtrare)
        const blogPosts = await BlogPosts.find({ author: author.email });
        // Rispondo con i post del blog
        res.json(blogPosts);
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// PATCH /authors/:authorId/avatar: Carica un'immagine avatar per l'autore specificato
router.patch('/:authorId/avatar', cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        // Verifico se è stato caricato un file
        if (!req.file) {
            return res.status(400).json({ message: "Nessun file caricato" });
        }
        // Trovo l'autore per ID
        const author = await Authors.findById(req.params.authorId);
        if (!author) {
            // Se l'autore non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Autore non trovato" });
        }
        // Aggiorno l'URL dell'avatar dell'autore con il percorso del file caricato
        author.avatar = req.file.path;
        // Salvo le modifiche
        await author.save();
        // Rispondo con l'autore aggiornato
        res.json(author);
    } catch (error) {
        // Se c'è un errore, rispondo con un errore 500
        console.error("Errore durante l'aggiornamento dell'avatar:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

export default router;
