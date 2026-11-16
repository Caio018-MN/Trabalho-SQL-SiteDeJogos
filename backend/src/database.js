const { MongoClient } = require('mongodb');
let client;
let db;

async function conectarBanco() {
    const uri  = process.env.MONGODB_URI;
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

function obterBanco() {

    if (!db) {
        throw new Error("Banco de dados não conectado.");
    }

    return db;
}

         // funçao de coleçao
function obterColecao(nome) {

    return obterBanco().collection(nome);
}
async function fecharConexao() {
    if (client) {
        await client.close();
        client = null;
        db = null;

        console.log("Conexão com MongoDB encerrada.");
    }
}





          // Disponibiliza as funções para outros arquivos
module.exports = {
    conectarBanco,
    obterBanco,
    obterColecao,
    fecharConexao
};
