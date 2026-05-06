const categoryService = require('../service/category.service');

const create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido'
            });
        }

        const category = await categoryService.create({ name });

        return res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: category
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
        const categories = await categoryService.findAll();

        return res.status(200).json({
            success: true,
            data: categories
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
        const category = await categoryService.findById(id);

        return res.status(200).json({
            success: true,
            data: category
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
        const updated = await categoryService.update(id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
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
        const deleted = await categoryService.remove(id);

        return res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente',
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
