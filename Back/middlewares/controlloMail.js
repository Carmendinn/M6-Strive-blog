const controlloMail = (req, res, next) => {
    // Definisco l'email autorizzata.
    const mail = 'autorizzato@gmail.com';
    // Estraggo l'email dell'utente dall'header della richiesta.
    const mailUtente = req.headers['user-email'];

    // Confronto l'email autorizzata con l'email dell'utente.
    if (mail === mailUtente) {
        // Se le email corrispondono, passo il controllo al prossimo middleware o route handler.
        next();
    } else {
        // Se le email non corrispondono, rispondo con un errore di accesso negato.
        res.status(403).json({ message: 'Accesso negato, utente non autorizzato' });
    }
}

export default controlloMail;
