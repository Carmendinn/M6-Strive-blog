import listEndpoints from "express-list-endpoints";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import blogPostsRoutes from "../Back/routes/BlogPostsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from '../Back/routes/authRoutes.js' 
import session from 'express-session';
import passport from "../Back/config/passportConfig.js";
import { badRequestHandler, authorizedHandler, notFoundHandler, genericErrorHandler,} from "../Back/middlewares/errorHandlers.js";
import authorsRoutes from '../Back/routes/AuthorsRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

dotenv.config();     //configuro dotenv

const app = express();  //configuro app


const corsOptions = {     //configuro cors
  origin: function (origin, callback) {
    
    const whitelist = [
      'http://localhost:5173', // sviluppo
      'https://strive-blog-delta.vercel.app', //vercel
      'https://strive-blog-ubre.onrender.com' //render
    ];
    
    if (process.env.NODE_ENV === 'development') {
      
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true 
};


app.use(cors(corsOptions));    //abilito cors su tutte le rotte

app.use(express.json());  

app.use(session({
  secret: process.env.SESSION_SECRET,  //firmo il cookie di sessione
  resave: false,
  saveUninitialized: false, // non crea una sessione fino alla memorizzazione di dati
}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/uploads', express.static(path.join(_dirname, 'uploads')));


mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('Mongo DB connesso'))
 .catch((err)=> console.error('Errore di connessione', err));


 app.use('/api/authors', authorsRoutes);
 app.use('/api/blogPosts', blogPostsRoutes);
 app.use('/api/auth', authRoutes);

 const PORT = process.env.PORT || 5000;
 app.use(badRequestHandler); // Gestisce errori 400 Bad Request
 app.use(authorizedHandler); // Gestisce errori 401 Unauthorized
 app.use(notFoundHandler); // Gestisce errori 404 Not Found
 app.use(genericErrorHandler); 

 app.listen(PORT, () => {
    console.log('Server connesso sulla porta'+ PORT);
    console.table(
      listEndpoints(app).map((route) => ({
        path: route.path,
        methods: route.methods.join(", "),
      })),
    );
 });

