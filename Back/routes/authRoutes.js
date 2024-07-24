import express from "express";
import passport from '../config/passportConfig.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateJWT } from "../utils/jwt.js";
import Authors from "../models/Authors.js";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

//login

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const author = await Authors.findOne({ email });
        if (!author) {
            return res.status(401).json({ message: 'Credenziali non valide' })
        }

        const isMatch = await author.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide' })

        }
        //se corrisponde genero il token JWT
        const token = await generateJWT({ id: author._id })
        res.json({ token, message: 'login effettuato' })

    } catch (error) {
        console.error('Errore nel login', error);
        res.status(500).json({ message: ' Errore nel server' });
    }
});
generateJWT// get/me utente collegato

router.get('/me', authMiddleware, (req, res) => {
    const authorData = req.author.toObject(); // converto doc mongoose in js
    delete authorData.password;   //cancello pw
    res.json(authorData);
});

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
    handleAuthCallback
  ); //get a google



async function handleAuthCallback(req, res) {
    try {
        const token = await generateJWT({ id: req.user._id });
        // Usa FRONTEND_URL per il reindirizzamento
        res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
        console.error('Errore nella generazione del token:', error);
        res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
}

export default router;