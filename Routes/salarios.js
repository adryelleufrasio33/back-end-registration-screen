import router from './users';
import { db } from '../db.js'; // Importa a conexão com o banco de dados




router.post('/store/salary', (req, res) => {
  const { tipo, nome, mes, ...fields } = req.body;

  console.log('Dados recebidos no request:', req.body); // Log dos dados recebidos no request

  let query = '';
  let values = [];
  console.log('Tipo de funcionário: loja');
  query = `
    INSERT INTO salarios_loja (nome, dias_trabalhados, salario, vale_alimentacao, vale_transporte, bonus_familia, inss, fgts, adiantamentos, mes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  values = [
      nome,
      fields.dias_trabalhados,
      fields.salario,
      fields.vale_alimentacao,
      fields.vale_transporte,
      fields.bonus_familia,
      fields.inss,
      fields.fgts,
      fields.adiantamentos,
      mes
  ];
  db.query(query, values, (err, result) => {
    if (err) {
        console.error('Erro ao registrar salário:', err);
        return res.status(500).json({ error: 'Erro ao registrar salário.' });
    }
    console.log('Salário registrado com sucesso! ID do registro:', result.insertId);
    res.status(201).json({ message: 'Salário registrado com sucesso!' });
});
});
router.post('/motocicle/salary', (req, res) => {
    const { tipo, nome, mes, ...fields } = req.body;
  
    console.log('Dados recebidos no request:', req.body); // Log dos dados recebidos no request
  let queryFuncionario = `Select * from cadastro_funcionarios where nome = '${nome}'`
  let func
    db.query(query,  (err, result) => {
      if (err) {
          console.error('Erro ao registrar salário:', err);
          return res.status(500).json({ error: 'Erro ao registrar salário.' });
      }
     func = result
    
    });
    console.log("otario")
    console.dir(func)
    let query = '';
    let values = [];
    console.log('Tipo de funcionário: loja');
    query = `
      INSERT INTO salario_motoqueiro (funcionario_id,mes_ano, premiacao_entrega, periculosidade, aluguel_moto, dias_trabalhados, vale_alimentacao, combustivel, inss, fgts, adiantamentos)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;
  
 

    values = [
        nome,
        fields.dias_trabalhados,
        fields.salario,
        fields.vale_alimentacao,
        fields.vale_transporte,
        fields.bonus_familia,
        fields.inss,
        fields.fgts,
        fields.adiantamentos,
        mes
    ];
    db.query(query, values, (err, result) => {
      if (err) {
          console.error('Erro ao registrar salário:', err);
          return res.status(500).json({ error: 'Erro ao registrar salário.' });
      }
      console.log('Salário registrado com sucesso! ID do registro:', result.insertId);
      res.status(201).json({ message: 'Salário registrado com sucesso!' });
  });
  });
//   switch (tipo) {
//       case 'loja':
          
//           break;
//       case 'motoqueiro':
//           console.log('Tipo de funcionário: motoqueiro');
//           query = `
//             INSERT INTO salarios_motoqueiro (nome, premiacao_entrega, periculosidade, aluguel_moto, dias_trabalhados, vale_alimentacao, combustivel, inss, fgts, adiantamentos, mes)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//           `;
//           values = [
//               nome,
//               fields.premiacao_entrega,
//               fields.periculosidade,
//               fields.aluguel_moto,
//               fields.dias_trabalhados,
//               fields.vale_alimentacao,
//               fields.combustivel,
//               fields.inss,
//               fields.fgts,
//               fields.adiantamentos,
//               mes
//           ];
//           break;
//       case 'mecanico':
//           console.log('Tipo de funcionário: mecanico');
//           query = `
//             INSERT INTO salarios_mecanico (nome, comissao, dias_trabalhados, vale_transporte, vale_alimentacao, inss, fgts, adiantamentos, mes)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//           `;
//           values = [
//               nome,
//               fields.comissao,
//               fields.dias_trabalhados,
//               fields.vale_transporte,
//               fields.vale_alimentacao,
//               fields.inss,
//               fields.fgts,
//               fields.adiantamentos,
//               mes
//           ];
//           break;
//       case 'vendedor':
//           console.log('Tipo de funcionário: vendedor');
//           query = `
//             INSERT INTO salarios_vendedor (nome, salario, comissao, vale_transporte, vale_alimentacao, inss, fgts, adiantamentos, mes)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//           `;
//           values = [
//               nome,
//               fields.salario,
//               fields.comissao,
//               fields.vale_transporte,
//               fields.vale_alimentacao,
//               fields.inss,
//               fields.fgts,
//               fields.adiantamentos,
//               mes
//           ];
//           break;
//       default:
//           console.error('Erro: Tipo de funcionário inválido:', tipo);
//           return res.status(400).json({ error: 'Tipo de funcionário inválido.' });
//   }

//   console.log('Query a ser executada:', query);
//   console.log('Valores a serem inseridos:', values);

//   db.query(query, values, (err, result) => {
//       if (err) {
//           console.error('Erro ao registrar salário:', err);
//           return res.status(500).json({ error: 'Erro ao registrar salário.' });
//       }
//       console.log('Salário registrado com sucesso! ID do registro:', result.insertId);
//       res.status(201).json({ message: 'Salário registrado com sucesso!' });
//   });
// });
