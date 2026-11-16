
const { obterColecao } = require("../config/database");
const { criarNegociacao } = require("../models/negociacao");

// Cadastrar uma negociação
async function cadastrarNegociacao(dados) {
    const negociacao = criarNegociacao(dados);

    const resultado = await obterColecao("negociacoes").insertOne(negociacao);

    return resultado;
}

module.exports = {
    cadastrarNegociacao
};
