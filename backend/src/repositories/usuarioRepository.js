import { obterColecao } from '../config/database.js';
import { criarUsuario } from '../models/usuario.js';

export async function buscarUsuarioPorEmail(email) {
  const colecao = obterColecao('users');
  return await colecao.findOne({ email });
}

export async function cadastrarUsuario(dados) {
  const usuario = criarUsuario(dados);
  const colecao = obterColecao('users');
  const resultado = await colecao.insertOne(usuario);
  return { _id: resultado.insertedId, ...usuario };
}