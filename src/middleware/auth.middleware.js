const authService = require('../service/auth.service');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const token = req.headers.authorization?.split(' ')[1];

        // Verificar si el token existe
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar y decodificar el token
        const decoded = authService.verifyToken(token);

        // Agregar la información del usuario al request
        req.user = decoded;

        // Continuar con la siguiente función
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = authMiddleware;
