import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conectarBanco } from './config/database.js';
import destaquesRoutes from './routes/destaquesRoutes.js';
import gameRoutes from './routes/games.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
// Registra as rotas de jogos
app.use('/api/jogos', gameRoutes);
app.use('/api', destaquesRoutes);
app.get('/api/status', (req, res) => {
  res.json({ mensagem: 'Backend ativo!' });
});

async function iniciarServidor() {
  console.log('A tentar ligar ao MongoDB...');
  try {
    await conectarBanco();
    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  } catch (erro) {
    console.error('Falha ao iniciar o servidor:', erro.message);
    process.exit(1);
  }
}

iniciarServidor();