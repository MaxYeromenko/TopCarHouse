const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const data = await CarModel.find();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
};
