import mongoose from 'mongoose';

const jogoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    categoria: { type: String, default: 'Geral' },
    preco: { type: Number, default: 0 },
    imagem: { type: String, default: '' },
    favorito: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Jogo = mongoose.models.Jogo || mongoose.model('Jogo', jogoSchema);

export default Jogo;
