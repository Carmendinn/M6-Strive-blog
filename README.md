Ciao Simone,
come ultimo progetto ho pensato ad un sito per adozioni di animali domestici.
Purtroppo il contenuto è blando perchè ho cercato di sviluppare prima le funzionalità e poi, nel caso avrei implementato il tutto.

L'App è stata gestita con Vite e Taiwind per lo stile.

Ho creato le due cartelle prima Backend e poi Frontend. 
Ho popolato il database tramite Postman e successivamente, collegando il backend ed il frontend tramite i CORS, da form del componente CreatePost.

Ho inserito i campi di Login e Register, entrambi danno la possibilità di inserire un avatar, che funzionavano perfettamente ed implementato con il login di Google.
Successivamente ho costruito una barra di ricerca nella Home gestendo un componente a parte e quindi ho creato una pagina 'not found' per un'esperienza lato client migliore.

Ho avuto problemi con le chiamate di delete e update dei commenti, sicuramente causa Id - nb ho utilizzato Axios

Per quanto riguarda i deploy su render e vercel, il primo mi ha dato problemi generando un errore collegato al bcrypt, per cui falliva.
Ovviamente non sono riuscita ad effettuare il login, la registrazione o qualsiasi altra attività sull'App.

NB. Se vuoi visualizzare l'App priva di modifiche di deploy, dovresti vedere il commit 3. TUTTI I COMMIT 4 FINO AL 4.9 sono di DEPLOY
