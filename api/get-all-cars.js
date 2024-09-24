const { mongoose, DataModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const data = await DataModel.find();
            res.status(200).json(data);
        } catch (err) {
            console.error(err); // Рекомендуется логировать ошибку для отладки
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
};
