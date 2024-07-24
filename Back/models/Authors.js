import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String}, 
  email: { type: String, unique: true }, 
  dataDiNascita: { type: String },
  avatar: { type: String },
  password: { type: String }, 
  googleId: { type: String },
 
}, {
  timestamps: true,
  collection: "authors"
});


// verifica pw
authorSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

authorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
});
export default mongoose.model("Authors", authorSchema); 
