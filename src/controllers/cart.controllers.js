const cartService = require('../service/cart.service');

const getMyCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const cart = await cartService.getMyCart(userId);

        return res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const addItem = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const cart = await cartService.addItem(userId, req.body);

        return res.status(200).json({
            success: true,
            message: 'Item agregado al carrito',
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const cart = await cartService.updateItemQuantity(userId, req.body);

        return res.status(200).json({
            success: true,
            message: 'Carrito actualizado',
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const removeItem = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const { productId } = req.params;
        const cart = await cartService.removeItem(userId, productId);

        return res.status(200).json({
            success: true,
            message: 'Item eliminado del carrito',
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const cart = await cartService.clearCart(userId);

        return res.status(200).json({
            success: true,
            message: 'Carrito vaciado',
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
};
