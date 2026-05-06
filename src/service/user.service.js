const User = require('../models/User');

const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('Usuario no encontrado');
    return user;
};

const updateMe = async (userId, data) => {
    const allowed = {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        address: data.address
    };

    Object.keys(allowed).forEach((k) => {
        if (typeof allowed[k] === 'undefined') delete allowed[k];
    });

    const updated = await User.findByIdAndUpdate(
        userId,
        { $set: allowed },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updated) throw new Error('Usuario no encontrado');
    return updated;
};

module.exports = {
    getMe,
    updateMe
};
