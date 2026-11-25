import 'dotenv/config';
import { MongoClient } from 'mongodb';
import redisClient from './src/config/redis.js';

const URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

// Mapeamento flexível cobrindo os nomes reais da sua coleção e os clássicos
const mapeamento = [
    { padrao: /sonic/i, imagem: 'imagens/sonic.jpg' },
    { padrao: /doom/i, imagem: 'imagens/doom.jpg' },
    { padrao: /zelda/i, imagem: 'imagens/zelda.jpg' },
    { padrao: /pokemon/i, imagem: 'imagens/pokemon.jpg' },
    { padrao: /mario/i, imagem: 'imagens/mario.jpg' }
];

async function atualizar() {
    const client = new MongoClient(URI);

    try {
        console.log('🔄 A ligar ao MongoDB...');
        await client.connect();

        // 1. Localizar a base de dados correta que contém documentos na coleção 'games'
        const adminDb = client.db().admin();
        const { databases } = await adminDb.listDatabases();

        let dbAlvo = null;
        let colecaoAlvo = null;

        for (const d of databases) {
            // Ignora bases de dados do sistema
            if (['admin', 'local', 'config'].includes(d.name)) continue;

            const base = client.db(d.name);
            const cols = await base.listCollections().toArray();
            const temColecaoGames = cols.some(c => c.name === 'games');

            if (temColecaoGames) {
                const contagem = await base.collection('games').countDocuments();
                if (contagem > 0) {
                    dbAlvo = base;
                    colecaoAlvo = base.collection('games');
                    console.log(` Base de dados identificada: "${d.name}" (${contagem} jogos encontrados)`);
                    break;
                }
            }
        }

        if (!colecaoAlvo) {
            console.log('⚠️ Tentando fallback com a base de dados padrão definida nas variáveis...');
            dbAlvo = client.db(process.env.DB_NAME || 'retro_games');
            colecaoAlvo = dbAlvo.collection('games');
        }

        // 2. Aplicar as imagens com base nos padrões
        let totalAtualizados = 0;
        for (const item of mapeamento) {
            const res = await colecaoAlvo.updateOne(
                { nome: item.padrao },
                { $set: { imagem: item.imagem } }
            );

            if (res.matchedCount > 0) {
                console.log(` Atualizado: ${item.imagem} (Documentos modificados: ${res.modifiedCount})`);
                totalAtualizados++;
            } else {
                console.log(`⚠️ Nenhum jogo coincidiu com: ${item.padrao}`);
            }
        }

        // Se nenhum nome bateu, associa as imagens sequencialmente aos primeiros 5 jogos
        if (totalAtualizados === 0) {
            console.log('🔄 Nomes específicos não coincidiram. A atribuir imagens aos 5 primeiros jogos da coleção...');
            const imagensDisponiveis = [
                'css/imagens/doom.jpg',
                'css/imagens/zelda.jpg',
                'css/imagens/sonic.jpg',
                'css/imagens/pokemon.jpg',
                'css/imagens/mario.jpg'
            ];

            const jogos = await colecaoAlvo.find({}).limit(5).toArray();
            for (let i = 0; i < jogos.length; i++) {
                await colecaoAlvo.updateOne(
                    { _id: jogos[i]._id },
                    { $set: { imagem: imagensDisponiveis[i] } }
                );
                console.log(` Atribuído "${imagensDisponiveis[i]}" ao jogo "${jogos[i].nome || jogos[i]._id}"`);
            }
        }

        // 3. Limpeza do cache Redis
        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
            }
            await redisClient.del('jogos:destaques_semana');
            console.log('🧹 Cache "jogos:destaques_semana" limpa no Redis.');
        } catch (errRedis) {
            console.log('⚠️ Aviso ao limpar Redis:', errRedis.message);
        }

        console.log(' Concluído com sucesso!');
    } catch (erro) {
        console.error('❌ Erro durante a execução:', erro);
    } finally {
        await client.close();
        process.exit(0);
    }
}

atualizar();