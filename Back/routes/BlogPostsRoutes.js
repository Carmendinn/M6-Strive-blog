
import express from "express";
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from '../config/claudinaryConfig.js'
import { sendEmail } from "../services/emailService.js"; // Import del codice per l'invio delle mail (INVIO MAIL)
import { authMiddleware } from "../middlewares/authMiddleware.js";




const router = express.Router();
router.use(authMiddleware); 
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' })
        } else {
            res.json(post);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
      let query = {};
      // Se c'è un parametro 'title' nella query, crea un filtro per la ricerca case-insensitive
      if (req.query.title) {
        query.title = { $regex: req.query.title, $options: "i" }; // Per fare ricerca case-insensitive:
        // Altrimenti per fare ricerca case-sensitive -> query.title = req.query.title;
      }
      // Cerca i blog post nel database usando il filtro (se presente)
      const blogPosts = await BlogPosts.find(query);
      // Invia la lista dei blog post come risposta JSON
      res.json(blogPosts);
    } catch (err) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: err.message });
    }
  });




/*router.post('/', async (req, res) => {
    const post = new BlogPosts(req.body);
        try {
            const newPost = await post.save();
            res.status(201).json(newPost);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
}); */

router.post('/', cloudinaryUploader.single('cover'), async (req, res,) => {
    try {
        const postData = req.body;
        if (req.file) {
            postData.cover = req.file.path; // cloudinary

        }
        const newPost = new BlogPosts(postData);
        await newPost.save();
        const htmlContent = `
          <h1>Il tuo post è stato pubblicato!</h1>
          <p>Ciao ${newPost.author},</p>
          <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
          <p>Categoria: ${newPost.category}</p>
          <p>Grazie per il tuo contributo al blog!</p>
    `;
        await sendEmail(newPost.author,'Il tuo post è stato correttamente pubblicato', htmlContent)
        res.status(201).json(newPost)
    } catch (error) {
        console.error('Errore nella creazione', error);
        res.status(400).json({ message: error.message })
    }
});




router.put('/:id', async (req, res) => {
    try {
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updatePost) {
            return res.status(404).json({ message: 'Post non trovato' })
        }
        else {
            res.json(updatePost);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPosts.findByIdAndDelete(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post non trovato' })
        }
        else {
            res.json({ message: 'Post cancellato' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPosts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    console.log("Commenti del post:", post.comments); // Log dei commenti esistenti
    res.json(post.comments);
  } catch (error) {
    console.error("Errore nel recupero dei commenti:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/comments/:commentId', async (req, res) => {
    try {
        const comment = await BlogPosts.findById(req.params.id);

        if (!comment) {
            return res.status(404).json ({ message: 'Il post non esiste'})
        }
    } catch (error) {
        res.status(500).json({ message: err.message})
    }
});
router.post("/:id/comments", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Crea un nuovo oggetto commento con i dati forniti
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
      };
      // Aggiungi il nuovo commento all'array dei commenti del post
      post.comments.push(newComment);
      // Salva le modifiche nel database
      await post.save();
      // Invia il nuovo commento come risposta JSON con status 201 (Created)
      res.status(201).json(newComment);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(400).json({ message: error.message });
    }
  });
  
  // PUT /blogPosts/:id/comments/:commentId => cambia un commento di un post specifico
  router.put("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
  
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
  
      if (!req.body.content) {
        return res.status(400).json({ message: "Il contenuto del commento non può essere vuoto" });
      }
  
      // Aggiorna il commento
      comment.content = req.body.content;
      await post.save();
  
      res.json(comment);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del commento:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      comment.remove(); // Rimuove il commento
      await post.save(); // Salva le modifiche
      res.status(200).json({ message: "Commento eliminato" });
    } catch (error) {
      console.error("Errore nella cancellazione del commento:", error); // Aggiungi il log dell'errore
      res.status(500).json({ message: error.message });
    }
  });
  

  


export default router; 