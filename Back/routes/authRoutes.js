import express from "express";
import passport from '../config/passportConfig.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateJWT } from "../utils/jwt.js";
import Authors from "../models/Authors.js";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log("Ricevuta richiesta di login con email:", email); // Log per debug
      const author = await Authors.findOne({ email });
      if (!author) {
          return res.status(401).json({ message: 'Credenziali non valide' });
      }
      const isMatch = await author.comparePassword(password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Credenziali non valide' });
      }
      const token = await generateJWT({ id: author._id });
      res.json({ token, message: 'Login effettuato' });
  } catch (error) {
      console.error('Errore nel login', error); // Log per debug
      res.status(500).json({ message: 'Errore nel server' });
  }
});
generateJWT// get/me utente collegato

router.get('/me', authMiddleware, (req, res) => {
  const authorData = req.author.toObject(); // converto doc mongoose in js
  delete authorData.password;   //cancello pw
  res.json(authorData);
});
//login

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  // Passport tenta di autenticare l'utente con le credenziali Google
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  // Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login
  
  async (req, res) => {
    try {
      // A questo punto, l'utente è autenticato con successo
      // req.user contiene i dati dell'utente forniti da Passport

      // Genera un JWT (JSON Web Token) per l'utente autenticato
      // Usiamo l'ID dell'utente dal database come payload del token
      const token = await generateJWT({ id: req.user._id });

      // Reindirizza l'utente al frontend, passando il token come parametro URL
      // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      // Se c'è un errore nella generazione del token, lo logghiamo
      console.error('Errore nella generazione del token:', error);
      // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);
export default router;