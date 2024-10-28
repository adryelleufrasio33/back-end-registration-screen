import express from 'express';
import cors from 'cors';  // Importa o CORS
import userRoutes from './Routes/users.js';  // Importa as rotas

const app = express();

// Configura o CORS para permitir requisições de diferentes portas
app.use(cors());

// Permite que o servidor entenda requisições JSON
app.use(express.json());

// Define as rotas do sistema
app.use("/", userRoutes);

// Inicia o servidor na porta 8800
app.listen(8800, () => {
    console.log('Servidor rodando na porta 8800');
});
