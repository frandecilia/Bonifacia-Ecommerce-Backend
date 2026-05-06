const productService = require('../service/product.service');

const create = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            image
        } = req.body;

        if (!name || !category || !description || typeof price === 'undefined' || !image) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        const product = await productService.create(req.body);

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const findAll = async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) filters.category = req.query.category;
        if (typeof req.query.featured !== 'undefined') {
            filters.featured = req.query.featured === 'true';
        }

        const products = await productService.findAll(filters);

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.findById(id);

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await productService.update(id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: updated
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await productService.remove(id);

        return res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: deleted
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
