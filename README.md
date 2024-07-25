Ciao Simone,
come ultimo progetto ho pensato ad un sito per adozioni di animali domestici.
Purtroppo il contenuto è blando perchè ho cercato di sviluppare prima le funzionalità e poi, nel caso avrei implementato il tutto.

L'App è stata gestita con Vite e Taiwind per lo stile.

Ho creato le due cartelle prima Backend e poi Frontend. 
Ho popolato il database tramite Postman e successivamente, collegando il backend ed il frontend tramite i CORS, da form del componente CreatePost.

Ho inserito i campi di Login e Register, entrambi danno la possibilità di inserire un avatar, che funzionavano perfettamente prima del deploy ed implementato con il login di Google.
Poi ho costruito una barra di ricerca nella Home gestendo un componente a parte e quindi ho creato una pagina 'not found' per un'esperienza lato client migliore.

Ho avuto problemi con le chiamate di delete e update dei commenti, sicuramente causa Id - nb ho utilizzato Axios
ora fixate che purtroppo non aggiornano la pagina automaticamente tornando alla home.

Per quanto riguarda il deploy su render e vercel, come sai, non funzionava causa repo che risultava corrotta ed ho dovuto crearne una nuova.
Ora viene deployato sia lato vercel sia lato render.

Post deploy non funzionavano l'autenticazione google e quella con credenziali (email e pwd). La prima ora è stata sistemata con il file vercel.json mentre la seconda mi crea ancora problemi.

Per quanto riguarda la registrazione, da errore nel momento ma crea comunque l'autore su compass.

Certamente avrei voluto fare di più, di questo mi dispiace, ma sono sicura di aver imparato sopratutto perchè ho affrontato mille problemi e per correttezza nei riguardi dei miei compagni, ho deciso di non implementare chissà quanto, ho giusto fixato delle piccole cose.



