function criarUsuario(dados) {

    if (!dados.nomeExibicao) {
        throw new Error("Nome de exibição é obrigatório.");
    }

    if (!dados.email) {
        throw new Error("E-mail é obrigatório.");
    }

    if (!dados.senhaHash) {
        throw new Error("Senha é obrigatória.");
    }

    return {
        nomeExibicao: dados.nomeExibicao,
        email: dados.email,
        senhaHash: dados.senhaHash,
        dataCadastro: new Date(),

        perfil: {
            descricao: dados.descricao || ""
        }
    };
}
module.exports = {
    criarUsuario
};
