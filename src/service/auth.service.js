const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
    // Registrar un nuevo usuario
    async register(userData) {
        try {
            const { name, username, email, password } = userData;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                throw new Error('El usuario o email ya está registrado');
            }

            // Encriptar contraseña antes de crear el usuario
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear nuevo usuario con contraseña encriptada
            const user = new User({
                name,
                username,
                email,
                password: hashedPassword
            });

            console.log('Intentando guardar usuario...');
            await user.save();
            console.log('Usuario guardado exitosamente');

            // Generar token
            const token = this.generateToken(user);

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    // Iniciar sesión
    async login(email, password) {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token
            const token = this.generateToken(user);

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    // Generar token JWT
    generateToken(user) {
        return jwt.sign(
            { 
                userId: user._id,
                email: user.email 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
    }

    // Verificar token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports = new AuthService();
