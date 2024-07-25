import Authors from '../models/Authors.js';
import { verifyJWT } from '../utils/jwt.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Estraggo il token di autorizzazione dall'header della richiesta.
        // Mi assicuro di rimuovere la stringa 'Bearer ' che precede il token.
        const token = req.headers.authorization?.replace('Bearer ', '');

        // Se il token non è presente, rispondo con un errore di autorizzazione.
        if (!token) {
            return res.status(401).send('Non autorizzato, manca token');
        }

        // Verifico la validità del token decodificandolo.
        const decoded = await verifyJWT(token);
        console.log('CLG AUTHMIDDLEWARE DECODED:', decoded);

        // Cerco l'autore nel database usando l'ID decodificato dal token.
        // Escludo il campo della password per sicurezza.
        const author = await Authors.findById(decoded.id).select('-password');
        console.log('CLG AUTHMIDDLEWARE AUTHOR:', author);

        // Se l'autore non viene trovato, rispondo con un errore di autorizzazione.
        if (!author) {
            return res.status(401).send('Autore non trovato');
        }

        // Associo l'oggetto dell'autore alla richiesta per utilizzi futuri.
        req.author = author;

        // Passo il controllo al prossimo middleware o alla route handler.
        next();
    } catch (error) {
        // In caso di errore durante la verifica del token, rispondo con un errore di autorizzazione.
        res.status(401).send('Token non valido');
    }
};
