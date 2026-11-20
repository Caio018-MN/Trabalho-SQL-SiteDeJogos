import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { obterColecao } from '../config/database.js';
import { buscarUsuarioPorEmail, cadastrarUsuario } from '../repositories/usuarioRepository.js';

const router = Router();

// ROTA DE REGISTO / CADASTRO
router.post('/register', async (req, res) => {
  try {
    const { nomeExibicao, email, senha } = req.body;

    if (!nomeExibicao || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
    }

    const emailFormatado = email.trim().toLowerCase();
    const colecao = obterColecao('users');
    const usuarioExistente = await colecao.findOne({ email: emailFormatado });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Este e-mail já se encontra registado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = {
      nomeExibicao,
      email: emailFormatado,
      senhaHash,
      dataCadastro: new Date(),
      perfil: { descricao: '' }
    };

    const resultado = await colecao.insertOne(novoUsuario);

    const token = jwt.sign(
      { id: resultado.insertedId, email: novoUsuario.email },
      process.env.JWT_SECRET || 'chave_secreta_retro_games',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensagem: 'Conta criada com sucesso!',
      token,
      usuario: {
        id: resultado.insertedId,
        nomeExibicao: novoUsuario.nomeExibicao,
        email: novoUsuario.email
      }
    });
  } catch (erro) {
    console.error('Erro no registo:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor ao registar utilizador.', erro: erro.message });
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    const emailFormatado = email.trim().toLowerCase();
    const colecao = obterColecao('users');

    // Procura por correspondência exata ou insensível a maiúsculas/minúsculas
    const usuario = await colecao.findOne({
      email: { $regex: `^${emailFormatado}$`, $options: 'i' }
    });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    // Aceita tanto senhaHash como senha (caso tenha sido gravado com nomes diferentes)
    const hashArmazenado = usuario.senhaHash || usuario.senha;
    if (!hashArmazenado) {
      return res.status(500).json({ mensagem: 'Utilizador sem senha configurada na base de dados.' });
    }

    const senhaValida = await bcrypt.compare(senha, hashArmazenado);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'chave_secreta_retro_games',
      { expiresIn: '7d' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nomeExibicao: usuario.nomeExibicao || usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao realizar login.', erro: erro.message });
  }
});

export default router;