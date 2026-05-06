const Category = require('../models/Category');

const create = async (data) => {
    const { name } = data;

    const existing = await Category.findOne({ name });
    if (existing) throw new Error('La categoría ya existe');

    const category = new Category({ name });
    await category.save();
    return category;
};

const findAll = async () => {
    return await Category.find().sort({ name: 1 });
};

const findById = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new Error('Categoría no encontrada');
    return category;
};

const update = async (id, data) => {
    const updated = await Category.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!updated) throw new Error('Categoría no encontrada');
    return updated;
};

const remove = async (id) => {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) throw new Error('Categoría no encontrada');
    return deleted;
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
