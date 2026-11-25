import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { obterColecao } from '../config/database.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas de jogos
router.use(autenticarToken);

// 1. Listar apenas os jogos do utilizador logado
router.get('/', async (req, res) => {
  try {
    const { busca } = req.query;
    const colecao = obterColecao('games');

    const filtro = { usuarioId: req.usuario.id };

    if (busca) {
      filtro.nome = { $regex: busca, $options: 'i' };
    }

    const jogos = await colecao.find(filtro).toArray();
    res.json(jogos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar jogos.', erro: erro.message });
  }
});

// 2. Criar jogo associado ao ID do utilizador logado
router.post('/', async (req, res) => {
  try {
    const { nome, plataforma, genero, anoLancamento, imagem } = req.body;

    if (!nome || !plataforma) {
      return res.status(400).json({ mensagem: 'Nome e plataforma são obrigatórios.' });
    }

    const colecao = obterColecao('games');
    const novoJogo = {
      nome,
      plataforma,
      genero: genero || '',
      anoLancamento: anoLancamento ? parseInt(anoLancamento, 10) : null,
      imagem: imagem || '',
      favorito: false,
      usuarioId: req.usuario.id, // Vínculo com a conta logada
      dataCriacao: new Date()
    };

    const resultado = await colecao.insertOne(novoJogo);
    res.status(201).json({ _id: resultado.insertedId, ...novoJogo });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao guardar jogo.', erro: erro.message });
  }
});

// 3. Alternar favorito (apenas do próprio utilizador)
router.patch('/:id/favorito', async (req, res) => {
  try {
    const { id } = req.params;
    const colecao = obterColecao('games');

    const jogo = await colecao.findOne({ _id: new ObjectId(id), usuarioId: req.usuario.id });
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado.' });
    }

    await colecao.updateOne(
      { _id: new ObjectId(id) },
      { $set: { favorito: !jogo.favorito } }
    );

    res.json({ mensagem: 'Favorito atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar favorito.', erro: erro.message });
  }
});

// 4. Remover jogo (apenas do próprio utilizador)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const colecao = obterColecao('games');

    const resultado = await colecao.deleteOne({
      _id: new ObjectId(id),
      usuarioId: req.usuario.id
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado ou não autorizado.' });
    }

    res.json({ mensagem: 'Jogo removido com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao remover jogo.', erro: erro.message });
  }
});


// Rota para atualizar campos do jogo (como anunciado ou favorito)
router.put('/jogos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacoes = req.body;
    const colecao = obterColecao('games');

    const resultado = await colecao.updateOne(
      { _id: new ObjectId(id) },
      { $set: atualizacoes }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    return res.json({ sucesso: true, modificado: resultado.modifiedCount });
  } catch (erro) {
    console.error('Erro ao atualizar jogo:', erro);
    return res.status(500).json({ erro: 'Erro interno ao atualizar jogo.' });
  }
});// Rota PUT para atualizar o estado do jogo (anunciado, favorito, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { anunciado, favorito } = req.body;
    const colecao = obterColecao('games');

    const updateFields = {};
    if (typeof anunciado !== 'undefined') updateFields.anunciado = anunciado;
    if (typeof favorito !== 'undefined') updateFields.favorito = favorito;

    const resultado = await colecao.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado no banco.' });
    }

    return res.json({ sucesso: true, modificado: resultado.modifiedCount });
  } catch (erro) {
    console.error('Erro ao atualizar jogo:', erro);
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;