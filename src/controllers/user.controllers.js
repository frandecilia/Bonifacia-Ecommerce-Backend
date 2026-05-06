const userService = require('../service/user.service');

const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const user = await userService.getMe(userId);

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const updated = await userService.updateMe(userId, req.body);

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updated
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMe,
    updateMe
};
