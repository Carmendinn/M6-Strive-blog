import crypto from 'crypto';

// Genera 64 byte di dati casuali e li converte in una stringa esadecimale
console.log(crypto.randomBytes(64).toString('hex'));
