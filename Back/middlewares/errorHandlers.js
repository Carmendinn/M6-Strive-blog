export const badRequestHandler = (err, req, res, next) => {
    // Controllo se l'errore ha uno status 400 (bad request) o se è un errore di validazione.
    if (err.status === 400 || err.name === 'ValidationError') {
        // Se è un errore di questo tipo, rispondo con uno status 400 e un messaggio JSON che descrive l'errore.
        res.status(400).json({
            error: 'Richiesta non valida',
            message: err.message
        });
    } else {
        // Se non è un errore di tipo bad request o validazione, passo l'errore al prossimo middleware.
        next(err);
    }
};

export const authorizedHandler = (err, req, res, next) => {
    // Controllo se l'errore ha uno status 401 (unauthorized).
    if (err.status === 401) {
        // Se è un errore di autorizzazione, rispondo con uno status 401 e un messaggio JSON che descrive l'errore.
        res.status(401).json({
            error: 'Errore autenticazione',
            message: 'Effettua nuova autenticazione'
        });
    } else {
        // Se non è un errore di tipo unauthorized, passo l'errore al prossimo middleware.
        next(err);
    }
};

export const notFoundHandler = (req, res, next) => {
    // Rispondo con uno status 404 (not found) e un messaggio JSON che descrive l'errore.
    res.status(404).json({
        error: 'Risorsa non trovata',
        message: 'La risorsa richiesta non è stata trovata'
    });
};

export const genericErrorHandler = (err, req, res, next) => {
    // Registro l'errore nel log del server.
    console.error(err.stack); 
    // Rispondo con uno status 500 (internal server error) e un messaggio JSON che descrive l'errore.
    res.status(500).json({
        error: 'Internal server error',
        message: 'Errore generico'
    });
};