
const { createClient } = require('redis');

let redisClient;

async function conectarRedis() {
    const url = process.env.REDIS_URL;

    if (!url) {
        throw new Error("REDIS_URL não configurada.");
    }

    redisClient = createClient({
        url: url
    });

    redisClient.on('error', (erro) => {
        console.error("Erro na conexão Redis:", erro);
    });

    await redisClient.connect();

    console.log("Redis conectado com sucesso!");

    return redisClient;
}

function obterRedis() {
    if (!redisClient || !redisClient.isReady) {
        throw new Error("Redis não está conectado.");
    }

    return redisClient;
}

async function fecharRedis() {
    if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
        redisClient = null;

        console.log("Conexão com Redis encerrada.");
    }
}

module.exports = {
    conectarRedis,
    obterRedis,
    fecharRedis
};

