const { obterColecao } = require("../config/database");
const { criarUsuario } = require("../models/usuario");


async function cadastrarUsuario(dados) {

    const usuario = criarUsuario(dados);

    const resultado = await obterColecao("usuarios").insertOne(usuario);

    return resultado;
}


module.exports = {
    cadastrarUsuario
};
