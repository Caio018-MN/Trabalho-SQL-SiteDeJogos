function criarJogo(dados) {

    if (!dados.titulo) {
        throw new Error("Título do jogo é obrigatório.");
    }

    if (!dados.plataforma) {
        throw new Error("Plataforma é obrigatória.");
    }

    if (!dados.genero) {
        throw new Error("Gênero é obrigatório.");
    }

    if (!Number.isInteger(dados.anoLancamento)) {
        throw new Error("Ano de lançamento deve ser um número inteiro.");
    }

    return {
        titulo: dados.titulo,
        plataforma: dados.plataforma,
        genero: dados.genero,
        anoLancamento: dados.anoLancamento,
        descricao: dados.descricao || ""
    };
}

module.exports = {
    criarJogo
};
