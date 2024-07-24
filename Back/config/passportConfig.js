import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Authors from '../models/Authors.js';
import passport from "passport";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
    
},
async function(accessToken, refreshToken, profile, done) {
  try {
    // Cerca prima l'utente per email
    let user = await Authors.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Se l'utente esiste ma non ha un googleId, aggiornalo
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      // Se l'utente non esiste, creane uno nuovo
      user = await Authors.create({
        googleId: profile.id,
        nome: profile.name.givenName,
        cognome: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
    }
    return done(null, user);
  } catch (error) {
    console.error('Errore durante l\'autenticazione Google:', error);
    return done(error, null);
  }
}));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Authors.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  export default passport;