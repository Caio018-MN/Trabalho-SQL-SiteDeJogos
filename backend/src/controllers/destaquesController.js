import { ObjectId } from 'mongodb';
import { obterColecao } from '../config/database.js';
import redisClient from '../config/redis.js';

const CHAVE_DESTAQUES = 'jogos:destaques_semana';
const CHAVE_RANKING = 'jogos:ranking_popularidade';

// 1. Destaques da semana com cache Redis (1 hora / 3600s)
export const obterDestaquesSemana = async (req, res) => {
    try {
        const cacheDestaques = await redisClient.get(CHAVE_DESTAQUES);
        if (cacheDestaques) {
            return res.status(200).json({
                origem: 'cache-redis',
                jogos: JSON.parse(cacheDestaques)
            });
        }

        const colecao = obterColecao('games');

        // Procura primeiro os favoritos; se não houver, traz os 6 mais recentes
        let jogosDestaque = await colecao.find({ favorito: true }).limit(6).toArray();
        if (!jogosDestaque || jogosDestaque.length === 0) {
            jogosDestaque = await colecao.find().sort({ _id: -1 }).limit(6).toArray();
        }

        await redisClient.set(CHAVE_DESTAQUES, JSON.stringify(jogosDestaque), {
            EX: 3600
        });

        return res.status(200).json({
            origem: 'mongodb',
            jogos: jogosDestaque
        });
    } catch (erro) {
        console.error('Erro nos destaques:', erro);
        return res.status(500).json({ erro: erro.message });
    }
};

// 2. Incrementar popularidade no Redis (ZINCRBY)
export const registarVisualizacao = async (req, res) => {
    try {
        const { jogoId } = req.params;
        const acessos = await redisClient.zIncrBy(CHAVE_RANKING, 1, jogoId);
        return res.status(200).json({ jogoId, acessos });
    } catch (erro) {
        console.error('Erro ao registar visualização:', erro);
        return res.status(500).json({ erro: erro.message });
    }
};

// 3. Obter Top 5 do ranking no Redis
export const obterRanking = async (req, res) => {
    try {
        const topIds = await redisClient.zRangeWithScores(CHAVE_RANKING, 0, 4, {
            REV: true
        });

        if (!topIds || topIds.length === 0) {
            return res.status(200).json({ ranking: [] });
        }

        // Monta a lista aceitando TANTO string pura QUANTO ObjectId
        const idsParaBuscar = [];
        topIds.forEach(item => {
            idsParaBuscar.push(item.value); // busca como String
            try {
                idsParaBuscar.push(new ObjectId(item.value)); // busca como ObjectId
            } catch {
                // se não for formato ObjectId válido, ignora
            }
        });

        const colecao = obterColecao('games');
        const jogos = await colecao.find({ _id: { $in: idsParaBuscar } }).toArray();

        const ranking = topIds.map((item, index) => {
            // Compara os IDs convertendo ambos para string
            const jogo = jogos.find(j => String(j._id) === String(item.value));
            return {
                posicao: index + 1,
                acessos: item.score,
                jogo: jogo || { _id: item.value, nome: 'Jogo Retro' }
            };
        });

        return res.status(200).json({ ranking });
    } catch (erro) {
        console.error('Erro ao obter ranking:', erro);
        return res.status(500).json({ erro: erro.message });
    }
};