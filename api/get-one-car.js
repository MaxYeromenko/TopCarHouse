const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const car = await CarModel.findById(id);
            res.status(200).json(car);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};