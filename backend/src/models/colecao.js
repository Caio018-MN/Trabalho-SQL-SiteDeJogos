function criarColecao(dados) {

    if (!dados.usuarioId) {
        throw new Error("Identificação do usuário é obrigatória.");
    }

    if (!dados.jogoId) {
        throw new Error("Identificação do jogo é obrigatória.");
    }

    if (!dados.condicao) {
        throw new Error("Condição do jogo é obrigatória.");
    }

    return {
        usuarioId: dados.usuarioId,
        jogoId: dados.jogoId,
        condicao: dados.condicao,
        observacoes: dados.observacoes || "",
        dataAdicao: new Date()
    };
}

module.exports = {
    criarColecao
};
