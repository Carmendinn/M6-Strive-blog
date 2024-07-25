import express from "express";
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from '../config/claudinaryConfig.js';
import { sendEmail } from "../services/emailService.js"; // Importo il servizio per l'invio delle email
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Importo il middleware di autenticazione

const router = express.Router();

// Applico il middleware di autenticazione a tutte le rotte
router.use(authMiddleware);

// GET /blogPosts/:id: Ottieni un post specifico per ID
router.get('/:id', async (req, res) => {
    try {
        // Cerco il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
            // Rispondo con il post trovato
            res.json(post);
        }
    } catch (err) {
        // Se c'è un errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// GET /blogPosts: Ottieni tutti i blog post, con possibilità di filtrare per titolo
router.get("/", async (req, res) => {
    try {
        let query = {};
        // Se c'è un parametro 'title' nella query, creo un filtro per la ricerca case-insensitive
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" }; // Per ricerca case-insensitive
        }
        // Cerco i blog post nel database usando il filtro (se presente)
        const blogPosts = await BlogPosts.find(query);
        // Rispondo con la lista dei blog post
        res.json(blogPosts);
    } catch (err) {
        // In caso di errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// POST /blogPosts: Crea un nuovo blog post con una copertura caricato su Cloudinary
router.post('/', cloudinaryUploader.single('cover'), async (req, res) => {
    try {
        // Creo un oggetto per il nuovo post con i dati della richiesta
        const postData = req.body;
        if (req.file) {
            // Se è stato caricato un file, aggiungo l'URL della copertura
            postData.cover = req.file.path; // Cloudinary
        }
        // Creo una nuova istanza di BlogPost e la salvo
        const newPost = new BlogPosts(postData);
        await newPost.save();
        
        // Creo il contenuto HTML per l'email di conferma
        const htmlContent = `
          <h1>Il tuo post è stato pubblicato!</h1>
          <p>Ciao ${newPost.author},</p>
          <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
          <p>Categoria: ${newPost.category}</p>
          <p>Grazie per il tuo contributo al blog!</p>
        `;
        // Invio l'email di conferma all'autore del post
        await sendEmail(newPost.author, 'Il tuo post è stato correttamente pubblicato', htmlContent);
        // Rispondo con il nuovo post creato e stato 201 (Creato)
        res.status(201).json(newPost);
    } catch (error) {
        // In caso di errore, loggo l'errore e rispondo con un errore 400
        console.error('Errore nella creazione', error);
        res.status(400).json({ message: error.message });
    }
});

// PUT /blogPosts/:id: Modifica un post esistente per ID
router.put('/:id', async (req, res) => {
    try {
        // Trovo e aggiorno il post per ID con i dati forniti
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Restituisco il documento aggiornato
        );
        if (!updatePost) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
            // Rispondo con il post aggiornato
            res.json(updatePost);
        }
    } catch (err) {
        // In caso di errore, rispondo con un errore 400
        res.status(400).json({ message: err.message });
    }
});

// DELETE /blogPosts/:id: Elimina un post esistente per ID
router.delete('/:id', async (req, res) => {
    try {
        // Trovo e elimino il post per ID
        const deletedPost = await BlogPosts.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
            // Rispondo con un messaggio di successo
            res.json({ message: 'Post cancellato' });
        }
    } catch (err) {
        // In caso di errore, rispondo con un errore 500
        res.status(500).json({ message: err.message });
    }
});

// GET /blogPosts/:id/comments: Ottieni tutti i commenti di un post specifico
router.get("/:id/comments", async (req, res) => {
    try {
        // Trovo il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Post non trovato" });
        }
        // Loggo i commenti del post per debugging
        console.log("Commenti del post:", post.comments);
        // Rispondo con la lista dei commenti del post
        res.json(post.comments);
    } catch (error) {
        // In caso di errore, loggo l'errore e rispondo con un errore 500
        console.error("Errore nel recupero dei commenti:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET /blogPosts/:id/comments/:commentId: Ottieni un commento specifico di un post
router.get('/:id/comments/:commentId', async (req, res) => {
    try {
        // Trovo il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Il post non esiste' });
        }
        // Trovo il commento specifico nel post
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            // Se il commento non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: 'Commento non trovato' });
        }
        // Rispondo con il commento trovato
        res.json(comment);
    } catch (error) {
        // In caso di errore, rispondo con un errore 500
        res.status(500).json({ message: error.message });
    }
});

// POST /blogPosts/:id/comments: Aggiungi un commento a un post specifico
router.post("/:id/comments", async (req, res) => {
    try {
        // Trovo il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Post non trovato" });
        }
        // Creo un nuovo commento con i dati forniti nella richiesta
        const newComment = {
            name: req.body.name,
            email: req.body.email,
            content: req.body.content,
        };
        // Aggiungo il nuovo commento all'array dei commenti del post
        post.comments.push(newComment);
        // Salvo le modifiche nel database
        await post.save();
        // Rispondo con il nuovo commento e stato 201 (Creato)
        res.status(201).json(newComment);
    } catch (error) {
        // In caso di errore, rispondo con un errore 400
        res.status(400).json({ message: error.message });
    }
});

// PUT /blogPosts/:id/comments/:commentId: Modifica un commento specifico di un post
router.put("/:id/comments/:commentId", async (req, res) => {
    try {
        // Trovo il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Post non trovato" });
        }
        // Trovo il commento specifico all'interno del post
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            // Se il commento non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Commento non trovato" });
        }
        // Aggiorno il contenuto del commento
        comment.content = req.body.content;
        // Salvo le modifiche nel database
        await post.save();
        // Rispondo con il commento aggiornato
        res.json(comment);
    } catch (error) {
        // In caso di errore, rispondo con un errore 400
        res.status(400).json({ message: error.message });
    }
});

// DELETE /blogPosts/:id/comments/:commentId: Elimina un commento specifico di un post
router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
        // Trovo il post per ID
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            // Se il post non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Post non trovato" });
        }
        // Trovo l'indice del commento specifico
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            // Se il commento non viene trovato, rispondo con un errore 404
            return res.status(404).json({ message: "Commento non trovato" });
        }
        // Rimuovo il commento dall'array dei commenti del post
        post.comments.splice(commentIndex, 1);
        // Salvo le modifiche nel database
        await post.save();
        // Rispondo con un messaggio di successo
        res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
        // In caso di errore, rispondo con un errore 500
        res.status(500).json({ message: error.message });
    }
});

export default router;
