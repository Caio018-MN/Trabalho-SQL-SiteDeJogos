import { obterRedis } from '../config/redis.js';

// Nome da chave onde o Redis armazenará o ranking
export const CHAVE_RANKING = 'retro_games_conquista:ranking:jogos';

// Registra uma visualização de um jogo
export async function registrarVisualizacao(idJogo) {
  if (!idJogo) {
    throw new Error('ID do jogo não informado.');
  }

  const redis = obterRedis();

  const pontuacao = await redis.zIncrBy(
    CHAVE_RANKING,
    1,
    String(idJogo)
  );

  return pontuacao;
}

// Retorna os jogos mais visualizados
export async function obterRanking(limite = 10) {
  if (!Number.isInteger(limite) || limite < 1) {
    throw new Error('O limite precisa ser um número inteiro positivo.');
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