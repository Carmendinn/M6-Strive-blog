import express from "express";
import Authors from "../models/Authors.js";
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";

const router = express.Router();

// GET /authors: Ottieni tutti gli autori
router.get('/', async (req, res) => {
    try {
        const authors = await Authors.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /authors/:id: Ottieni un autore specifico per ID
router.get('/:id', async (req, res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /authors: Crea un nuovo autore
router.post('/', async (req, res) => {
    const author = new Authors(req.body);
    try {
        
        const newAuthor = await author.save();
        const authorResponse = newAuthor.toObject();
        delete authorResponse.password; // Rimuove la password dalla risposta

        res.status(201).json(authorResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /authors/:id: Modifica un autore esistente per ID
router.put('/:id', async (req, res) => {
    try {
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateAuthor) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json(updateAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /authors/:id: Elimina un autore esistente per ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json({ message: 'Autore eliminato' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /authors/:id/blogPosts: Ottieni tutti i blog post di uno specifico autore
router.get('/:id/blogPosts', async (req, res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        const blogPosts = await BlogPosts.find({ author: author.email });
        res.json(blogPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /authors/:authorId/avatar: Carica un'immagine avatar per l'autore specificato
router.patch('/:authorId/avatar', cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Nessun file caricato" });
        }

        const author = await Authors.findById(req.params.authorId);
        if (!author) {
            return res.status(404).json({ message: "Autore non trovato" });
        }

        author.avatar = req.file.path; // Aggiorna l'URL dell'avatar dell'autore
        await author.save();

        res.json(author);
    } catch (error) {
        console.error("Errore durante l'aggiornamento dell'avatar:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

export default router;
