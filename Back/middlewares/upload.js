import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Imposto la destinazione dei file caricati nella cartella 'uploads/'.
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Genero un suffisso unico per il nome del file utilizzando il timestamp corrente e un numero casuale.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // 1e9 rappresenta 1 miliardo (9 zeri)
        // Imposto il nome del file come il nome del campo seguito dal suffisso unico e dall'estensione originale del file.
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export default upload;