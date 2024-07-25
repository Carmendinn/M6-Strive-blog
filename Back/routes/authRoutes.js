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
      next(error);
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
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  
  async (req, res) => {
    try {
     
      const token = await generateJWT({ id: req.user._id });

      
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      
      console.error('Errore nella generazione del token:', error);
      
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);
export default router;