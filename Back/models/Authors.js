import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// Definisco lo schema per il modello degli autori
const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // Nome dell'autore, obbligatorio
  cognome: { type: String }, // Cognome dell'autore, opzionale
  email: { type: String, unique: true }, // Email dell'autore, unica e obbligatoria
  dataDiNascita: { type: String }, // Data di nascita dell'autore, opzionale
  avatar: { type: String }, // URL dell'avatar dell'autore, opzionale
  password: { type: String }, // Password dell'autore, obbligatoria
  googleId: { type: String }, // ID di Google per l'autenticazione tramite Google, opzionale
}, {
  timestamps: true, // Aggiungo automaticamente i campi createdAt e updatedAt
  collection: "authors" // Specifico il nome della collezione nel database
});

// Definisco un metodo per confrontare la password fornita con quella hashata nel database
authorSchema.methods.comparePassword = async function(candidatePassword) {
  // Utilizzo bcrypt per confrontare la password fornita con quella memorizzata
  return await bcrypt.compare(candidatePassword, this.password);
};

// Definisco un middleware per eseguire prima del salvataggio del documento
authorSchema.pre('save', async function (next) {
    // Controllo se la password è stata modificata
    if (!this.isModified('password')) return next();
    try {
        // Genero un salt e hash la password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Procedo al salvataggio del documento
    } catch (error) {
        // Passo l'errore alla funzione middleware successiva
        next(error);
    }
});

// Esporto il modello per poterlo utilizzare in altre parti dell'applicazione
export default mongoose.model("Authors", authorSchema);
