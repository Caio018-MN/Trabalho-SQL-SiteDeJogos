import { Router } from 'express';
import {
    obterDestaquesSemana,
    obterRanking,
    registarVisualizacao
} from '../controllers/destaquesController.js';

const router = Router();

router.get('/destaques', obterDestaquesSemana);
router.get('/ranking', obterRanking);
// Rota pública de cliques sem o prefixo /jogos para evitar o bloqueio 401
router.post('/visualizacao/:jogoId', registarVisualizacao);

export default router;