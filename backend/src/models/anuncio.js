function criarAnuncio(dados) {

    if (!dados.usuarioId) {
        throw new Error("Identificação do usuário é obrigatória.");
    }

    if (!dados.jogoId) {
        throw new Error("Identificação do jogo é obrigatória.");
    }

    if (!dados.colecaoId) {
        throw new Error("Identificação da coleção é obrigatória.");
    }

    if (!["venda", "troca", "ambos"].includes(dados.modalidade)) {
        throw new Error("Modalidade deve ser venda, troca ou ambos.");
    }

    if (!dados.condicao) {
        throw new Error("Condição do jogo é obrigatória.");
    }

    if (
        dados.preco !== undefined &&
        dados.preco !== null &&
        (typeof dados.preco !== "number" ||
         !Number.isFinite(dados.preco) ||
         dados.preco < 0)
    ) {
        throw new Error("Preço deve ser um número válido e não negativo.");
    }

    return {
        usuarioId: dados.usuarioId,
        jogoId: dados.jogoId,
        colecaoId: dados.colecaoId,
        modalidade: dados.modalidade,
        preco: dados.preco ?? null,
        condicao: dados.condicao,
        status: "ativo",
        dataCriacao: new Date()
    };
}

module.exports = {
    criarAnuncio
};
