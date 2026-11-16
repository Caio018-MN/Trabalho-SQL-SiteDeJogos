const { obterColecao } = require("../config/database");
const { criarColecao } = require("../models/colecao");


async function cadastrarColecao(dados) {
    const colecao = criarColecao(dados);

    const resultado = await obterColecao("colecoes").insertOne(colecao);

    return resultado;
}

module.exports = {
    cadastrarColecao
};
