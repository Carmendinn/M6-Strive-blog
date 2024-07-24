import Authors from '../models/Authors.js';
import { verifyJWT } from '../utils/jwt.js';

export const authMiddleware = async ( req, res, next) =>{
    try {
        
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Non autorizzato, manca token');
        }
        const decoded = await verifyJWT(token);
        console.log('CLG AUTHMIDDLEWARE DECODED:' , decoded);
        const author = await Authors.findById(decoded.id).select('-password');
        console.log('CLG AUTHMIDDLEWARE AUTHOR:' , author);

        if (!author) {
            return res.status(401).send('Autore non trovato');
        }
        req.author = author;

        next();
    } catch (error) {
        res.status(401).send('Token non valido');
    }
};