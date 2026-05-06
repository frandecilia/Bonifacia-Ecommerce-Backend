const Order = require('../models/Order');
const Cart = require('../models/Cart');
const customerService = require('./customer.service');

const create = async (userId, shippingAddress) => {
    const customer = await customerService.findOrCreateByUserId(userId);
    const cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        populate: { path: 'category' }
    });

    if (!cart || cart.items.length === 0) throw new Error('Carrito vacío');

    const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
        user: customer._id,
        items,
        total,
        shippingAddress
    });

    await order.save();

    cart.items = [];
    await cart.save();

    return await Order.findById(order._id)
        .populate({
            path: 'items.product',
            populate: { path: 'category' }
        })
        .populate('user', '-password');
};

const getMyOrders = async (userId) => {
    const customer = await customerService.findOrCreateByUserId(userId);
    return await Order.find({ user: customer._id })
        .populate({
            path: 'items.product',
            populate: { path: 'category' }
        })
        .populate('user', '-password')
        .sort({ createdAt: -1 });
};

const updateStatus = async (orderId, status, userId) => {
    const customer = await customerService.findOrCreateByUserId(userId);
    const order = await Order.findOne({ _id: orderId, user: customer._id });
    
    if (!order) throw new Error('Orden no encontrada');

    order.status = status;
    await order.save();

    return await Order.findById(order._id)
        .populate({
            path: 'items.product',
            populate: { path: 'category' }
        })
        .populate('user', '-password');
};

module.exports = {
    create,
    getMyOrders,
    updateStatus
};
