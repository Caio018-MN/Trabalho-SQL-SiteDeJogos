import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Formato esperado: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_retro_games', (erro, usuario) => {
        if (erro) {
            return res.status(403).json({ mensagem: 'Sessão expirada ou token inválido.' });
        }
        // Injeta os dados do utilizador (id, email) no request
        req.usuario = usuario;
        next();
    });
}