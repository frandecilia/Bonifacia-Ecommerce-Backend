const authService = require('../service/auth.service');

class AuthController {
    // Registro de usuario
    async register(req, res) {
        try {
            const { name, username, email, password } = req.body;

            // Validación básica
            if (!name || !username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            const result = await authService.register({
                name,
                username,
                email,
                password
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Inicio de sesión
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validación básica
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            const result = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Verificar token (para rutas protegidas)
    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            const decoded = authService.verifyToken(token);

            res.status(200).json({
                success: true,
                message: 'Token válido',
                data: decoded
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
