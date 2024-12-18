import express from 'express';
import { db } from '../db.js'; // Importa a conexão com o banco de dados

const router = express.Router();

// Configurações básicas
const SALARIO_MINIMO = 1412;
const VALOR_VALE_TRANSPORTE = 9;
const VALOR_VALE_ALMOCO = 12.5;
const INSS_PERCENTUAL = 0.08; // 8%
const FGTS_PERCENTUAL = 0.08; // 8%

// Rota GET para buscar todos os funcionários
router.get('/users', (req, res) => {
    const query = 'SELECT * FROM cadastro_funcionarios';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar dados do banco de dados:", err);
            return res.status(500).json({ error: "Erro ao buscar dados do banco de dados." });
        }
        res.json(results || []);
    });
});

// Rota POST para cadastrar um novo funcionário
router.post('/users', async (req, res) => {
    const {
        nome,
        endereco,
        setor,
        telefone,
        conta_bancaria,
        cpf,
        rg,
        data_nascimento,
        data_admissão,
        email,
        funcao,
        salario_base,
        bonificacao,
    } = req.body;
    
    if (!nome || !cpf) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    try{
        let funcId = await getFuncionarioId(nome)
        if (funcId) return res.status(400).json({ error: "Usuário já está cadastrado na base de dados." });
    } catch (error) {
        res.status(500).json({ error: "Um erro ocorreu ao tentar verificar se o usuário estava cadastrado. Tente novamente." });
    }
    
    const query = `
        INSERT INTO cadastro_funcionarios (nome, endereco, setor, telefone, conta_bancaria, cpf, rg, data_nascimento, data_admissão, email, funcao, salario_base, bonificacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [nome, endereco, setor, telefone, conta_bancaria, cpf, rg, data_nascimento, data_admissão, email, funcao, salario_base, bonificacao],
        (err, result) => {
            if (err) {
                console.error("Erro ao cadastrar funcionário:", err);
                return res.status(500).json({ error: "Erro ao cadastrar funcionário." });
            }
            res.status(201).json({ message: "Funcionário cadastrado com sucesso!" });
        }
    );
});

const queryDatabase = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getFuncionarioId = async (nome) => {
    const queryFunc = `SELECT * FROM cadastro_funcionarios WHERE nome = ?`;
    const valuesFunc = [nome];
    try {
        const results = await queryDatabase(queryFunc, valuesFunc);
        if (results.length > 0) {
            return results[0].id;
        } else {
            return null;
        }
    } catch (err) {
        console.error("Erro ao buscar funcionário:", err);
        throw new Error("Erro ao buscar funcionário.");
    }
};


/** Rota POST para registrar salario - Loja */
router.post('/store/salary', async (req, res) => {
    const { nome, mes, dias_trabalhados, salario, vale_alimentacao, vale_transporte, bonus_familia, inss, fgts, adiantamentos } = req.body;

    // validação
    if (!nome || !mes || !dias_trabalhados) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    // busca pelo id do funcionário usando o nome
    let funcionario_id = null
    
    try {
        funcionario_id = await getFuncionarioId(nome);
        if (!funcionario_id) {
            return res.status(400).json({ error: "Funcionário não encontrado. Verifique o nome fornecido." });
        }
    } catch (error) {
        return res.status(400).json({ error: "Erro ao tentar encontrar funcionário. Verifique o nome fornecido." });
    }

    // cadastro da informação do salário no banco
    try {
        const query = `
            INSERT INTO salario_loja (funcionario_id, dias_trabalhados, salario, vale_alimentacao, vale_transporte, bonus_familia, inss, fgts, adiantamentos, mes_ano)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [funcionario_id, dias_trabalhados, salario, vale_alimentacao, vale_transporte, bonus_familia, inss, fgts, adiantamentos, mes]

        await queryDatabase(query, values)
        res.status(201).json({ message: "Salário registrado com sucesso para Loja!" });
    } catch {
        return res.status(500).json({ error: "Erro ao registrar salário." });
    }
});

/** Rota POST para registrar salario - Motoqueiro */
router.post('/motorcycle/salary', (req, res) => {
    console.log("entrou")
    const { funcionario_id, mes_ano, premiacao_entrega, periculosidade, aluguel_moto, dias_trabalhados, vale_alimentacao, combustivel, inss, fgts, adiantamentos } = req.body;

    if (!funcionario_id || !mes_ano) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const query = `
        INSERT INTO salario_motoqueiro (funcionario_id, mes_ano, premiacao_entrega, periculosidade, aluguel_moto, dias_trabalhados, vale_alimentacao, combustivel, inss, fgts, adiantamentos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [funcionario_id, mes_ano, premiacao_entrega, periculosidade, aluguel_moto, dias_trabalhados, vale_alimentacao, combustivel, inss, fgts, adiantamentos],
        (err) => {
            if (err) return res.status(500).json({ error: "Erro ao registrar salário." });
            res.status(201).json({ message: "Salário registrado com sucesso para Motoqueiro!" });
        }
    );
});

/** Rota POST para registrar salario - Oficina */
router.post('/mechanic/salary', (req, res) => {
    console.log("entrou")
   
    const { nome, mes, dias_trabalhados, salario_base, bonus, vale_transporte, fgts, inss } = req.body;

    if (!nome || !mes || !dias_trabalhados) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const query = `
        INSERT INTO salario_oficina (nome, mes, dias_trabalhados, salario_base, bonus, vale_transporte, fgts, inss)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [nome, mes, dias_trabalhados, salario_base, bonus, vale_transporte, fgts, inss],
        (err) => {
            if (err) return res.status(500).json({ error: "Erro ao registrar salário." });
            res.status(201).json({ message: "Salário registrado com sucesso para Oficina!" });
        }
    );
});

/** Rota POST para registrar salario - Vendedor */
router.post('/sales/salary', (req, res) => {
    console.log("entrou")
    const { funcionario_id, mes_ano, comissao, dias_trabalhados, vale_transporte, vale_alimentacao, inss, fgts, adiantamentos } = req.body;

    if (!funcionario_id || !mes_ano || comissao == null) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const query = `
        INSERT INTO salario_vendedor (funcionario_id, mes_ano, comissao, dias_trabalhados, vale_transporte, vale_alimentacao, inss, fgts, adiantamentos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [funcionario_id, mes_ano, comissao, dias_trabalhados, vale_transporte, vale_alimentacao, inss, fgts, adiantamentos],
        (err) => {
            if (err) return res.status(500).json({ error: "Erro ao registrar salário." });
            res.status(201).json({ message: "Salário registrado com sucesso para Vendedor!" });
        }
    );
});

export default router;

