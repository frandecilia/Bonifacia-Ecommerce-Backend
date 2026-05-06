const Product = require('../models/Product');
const Category = require('../models/Category');

const create = async (data) => {
    const {
        name,
        category,
        subCategory,
        description,
        price,
        scents,
        image,
        featured,
        stock
    } = data;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) throw new Error('Categoría inválida');

    const product = new Product({
        name,
        category,
        subCategory,
        description,
        price,
        scents,
        image,
        featured,
        stock
    });

    await product.save();
    return await Product.findById(product._id).populate('category');
};

const findAll = async (filters = {}) => {
    const query = {};

    if (filters.category) query.category = filters.category;
    if (typeof filters.featured !== 'undefined') query.featured = filters.featured;

    return await Product.find(query)
        .populate('category')
        .sort({ createdAt: -1 });
};

const findById = async (id) => {
    const product = await Product.findById(id).populate('category');
    if (!product) throw new Error('Producto no encontrado');
    return product;
};

const update = async (id, data) => {
    if (data.category) {
        const categoryExists = await Category.findById(data.category);
        if (!categoryExists) throw new Error('Categoría inválida');
    }

    const updated = await Product.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    ).populate('category');

    if (!updated) throw new Error('Producto no encontrado');
    return updated;
};

const remove = async (id) => {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw new Error('Producto no encontrado');
    return deleted;
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
