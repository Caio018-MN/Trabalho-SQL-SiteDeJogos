function criarNegociacao(dados) {

    if (!dados.anuncioId) {
        throw new Error("Identificação do anúncio é obrigatória.");
    }

    if (!dados.proprietarioId) {
        throw new Error("Identificação do proprietário é obrigatória.");
    }

    if (!dados.interessadoId) {
        throw new Error("Identificação do interessado é obrigatória.");
    }

    if (dados.proprietarioId === dados.interessadoId) {
        throw new Error("O proprietário não pode negociar consigo mesmo.");
    }

    if (!dados.proposta) {
        throw new Error("A proposta é obrigatória.");
    }

    return {
        anuncioId: dados.anuncioId,
        proprietarioId: dados.proprietarioId,
        interessadoId: dados.interessadoId,
        proposta: dados.proposta,
        estado: "pendente",
        dataCriacao: new Date()
    };
}

module.exports = {
    criarNegociacao
};
