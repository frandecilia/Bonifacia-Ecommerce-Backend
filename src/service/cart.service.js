const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getOrCreateCartByUserId = async (userId) => {
    const existing = await Cart.findOne({ user: userId });
    if (existing) return existing;

    const cart = new Cart({ user: userId, items: [] });
    await cart.save();
    return cart;
};

const getMyCart = async (userId) => {
    const cart = await getOrCreateCartByUserId(userId);

    return await Cart.findById(cart._id)
        .populate({
            path: 'items.product',
            populate: { path: 'category' }
        })
        .populate({ path: 'user', select: '-password' });
};

const addItem = async (userId, data) => {
    const { productId, quantity } = data;

    const qty = Number(quantity);
    if (!productId || !qty || qty < 1) throw new Error('Datos inválidos');

    const product = await Product.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const cart = await getOrCreateCartByUserId(userId);

    const existingIndex = cart.items.findIndex((i) => String(i.product) === String(productId));

    if (existingIndex >= 0) {
        cart.items[existingIndex].quantity += qty;
    } else {
        cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    return await getMyCart(userId);
};

const updateItemQuantity = async (userId, data) => {
    const { productId, quantity } = data;

    const qty = Number(quantity);
    if (!productId || !qty || qty < 1) throw new Error('Datos inválidos');

    const cart = await getOrCreateCartByUserId(userId);

    const existingIndex = cart.items.findIndex((i) => String(i.product) === String(productId));
    if (existingIndex < 0) throw new Error('Item no encontrado en el carrito');

    cart.items[existingIndex].quantity = qty;

    await cart.save();
    return await getMyCart(userId);
};

const removeItem = async (userId, productId) => {
    if (!productId) throw new Error('Producto inválido');

    const cart = await getOrCreateCartByUserId(userId);

    cart.items = cart.items.filter((i) => String(i.product) !== String(productId));

    await cart.save();
    return await getMyCart(userId);
};

const clearCart = async (userId) => {
    const cart = await getOrCreateCartByUserId(userId);
    cart.items = [];
    await cart.save();
    return await getMyCart(userId);
};

module.exports = {
    getMyCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
};
