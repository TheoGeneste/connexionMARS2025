import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';

// Configuration pour le fichier .env
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Middleware pour autoriser les requêtes CORS
app.use(cors());

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());


// Importation des routes
app.use('/api', clientRoutes);

// Démarrage du serveur
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running : http://127.0.0.1:${process.env.SERVER_PORT}`);
});