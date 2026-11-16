
const { obterColecao } = require("../config/database");
const { criarAnuncio } = require("../models/anuncio");

// Cadastrar um anúncio
async function cadastrarAnuncio(dados) {
    const anuncio = criarAnuncio(dados);

    const resultado = await obterColecao("anuncios").insertOne(anuncio);

    return resultado;
}

module.exports = {
    cadastrarAnuncio
};
