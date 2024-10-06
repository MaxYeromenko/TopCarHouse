const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const brands = await CarModel.distinct('brand');
            const countries = await CarModel.distinct('country');
            const bodyTypes = await CarModel.distinct('features.body_type');
            const transmissions = await CarModel.distinct('features.transmission');

            res.status(200).json({
                brands,
                countries,
                bodyTypes,
                transmissions
            });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
