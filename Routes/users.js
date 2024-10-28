import express from 'express';
import { db } from '../db.js';  // Importa a conexão com o banco de dados

const router = express.Router();

// Rota GET para buscar dados da tabela "cadastro_funcionarios"
router.get('/users', (req, res) => {
    const query = 'SELECT * FROM cadastro_funcionarios';  // Query correta para buscar dados
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao executar a query:", err);  // Loga o erro, caso ocorra
            return res.status(500).json({ error: "Erro ao buscar dados do banco de dados." });
        }
        console.log(results);  // Exibe os resultados no console do servidor
        res.json(results);  // Retorna os resultados ao front-end como JSON
    });
});

// Rota POST para cadastrar um novo funcionário
router.post('/users', (req, res) => {
    console.log(req.body);  // Exibe os dados recebidos no console

    // As variáveis devem corresponder aos nomes das colunas no banco de dados
    const { nome, endereco, setor, telefone, conta_bancaria, cpf, rg, data_nascimento, data_admissão, email, funcao } = req.body;

    // Query SQL para inserir um novo funcionário
    const query = `
        INSERT INTO cadastro_funcionarios (nome, endereco, setor, telefone, conta_bancaria, cpf, rg, data_nascimento, data_admissão, email, funcao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nome, endereco, setor, telefone, conta_bancaria, cpf, rg, data_nascimento, data_admissão, email, funcao], (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar funcionário:", err);
            return res.status(500).json({ error: "Erro ao cadastrar funcionário." });
        }
        res.status(201).json({ message: "Funcionário cadastrado com sucesso!" });
    });
});

// Exportando o router como default para que possa ser importado em index.js
export default router;
