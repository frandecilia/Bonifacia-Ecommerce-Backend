const orderService = require('../service/order.service');

const create = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Dirección de envío requerida'
            });
        }

        const order = await orderService.create(userId, shippingAddress);

        return res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente',
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const orders = await orderService.getMyOrders(userId);

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: 'ID de orden y status requeridos'
            });
        }

        const order = await orderService.updateStatus(orderId, status, userId);

        return res.status(200).json({
            success: true,
            message: 'Estado de orden actualizado',
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    create,
    getMyOrders,
    updateStatus
};
