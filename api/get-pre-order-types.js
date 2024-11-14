const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const carsList = await CarModel.find({}, 'brand model price');

            const cars = carsList.map(car => `${car.brand} ${car.model}, ${car.price}`);

            res.status(200).json({
                cars
            });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
