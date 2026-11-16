
const { obterRedis } = require('../config/redis');

// Nome da chave onde o Redis armazenará o ranking.
const CHAVE_RANKING = 'retro_games_conquista:ranking:jogos';

// Registra uma visualização de um jogo.
async function registrarVisualizacao(idJogo) {
    if (!idJogo) {
        throw new Error("ID do jogo não informado.");
    }

    const redis = obterRedis();

    const pontuacao = await redis.zIncrBy(
        CHAVE_RANKING,
        1,
        String(idJogo)
    );

    return pontuacao;
}

// Retorna os jogos mais visualizados.
async function obterRanking(limite = 10) {
    if (!Number.isInteger(limite) || limite < 1) {
        throw new Error("O limite precisa ser um número inteiro positivo.");
    }

    const redis = obterRedis();

    const ranking = await redis.zRangeWithScores(
        CHAVE_RANKING,
        0,
        limite - 1,
        { REV: true }
    );

    return ranking;
}

module.exports = {
    registrarVisualizacao,
    obterRanking,
    CHAVE_RANKING
};

