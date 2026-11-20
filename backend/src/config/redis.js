import { createClient } from 'redis';

let clienteRedis = null;

export async function conectarRedis() {
  try {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    clienteRedis = createClient({ url });

    clienteRedis.on('error', (erro) => {
      console.warn('Aviso Redis:', erro.message);
    });

    await clienteRedis.connect();
    console.log('Redis conectado com sucesso!');
    return clienteRedis;
  } catch (erro) {
    console.warn('Aviso: Não foi possível conectar ao Redis. O ranking ficará inativo temporariamente.');
    clienteRedis = null;
  }
}

export function obterRedis() {
  if (!clienteRedis) {
    throw new Error('Cliente Redis não conectado ou indisponível.');
  }
  return clienteRedis;
}