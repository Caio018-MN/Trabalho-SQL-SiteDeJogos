import { MongoClient } from 'mongodb';

let client;
let db;

export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  const nomeBanco = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("MONGODB_URI não configurada.");
  }

  if (!nomeBanco) {
    throw new Error("MONGODB_DB_NAME não configurada.");
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db(nomeBanco);

  console.log("MongoDB conectado com sucesso!");

  return db;
}

export function obterBanco() {
  if (!db) {
    throw new Error("Banco de dados não conectado.");
  }

  return db;
}

export function obterColecao(nome) {
  return obterBanco().collection(nome);
}

export async function fecharConexao() {
  if (client) {
    await client.close();
    client = null;
    db = null;

    console.log("Conexão com MongoDB encerrada.");
  }
}