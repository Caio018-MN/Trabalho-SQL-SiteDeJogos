const { obterColecao } = require("../config/database");
const { criarJogo } = require("../models/jogo");

// Cadastrar um jogo
async function cadastrarJogo(dados) {
    const jogo = criarJogo(dados);

    const resultado = await obterColecao("jogos").insertOne(jogo);

    return resultado;
}

module.exports = {
    cadastrarJogo
};
