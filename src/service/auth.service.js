const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (error) {
        throw new Error('Token inválido');
    }
};

const register = async (userData) => {
    const { name, username, email, password } = userData;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new Error('El usuario o email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        username,
        email,
        password: hashedPassword
    });
    await user.save();

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        },
        token
    };
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        },
        token
    };
};

module.exports = {
    register,
    login,
    generateToken,
    verifyToken
};
