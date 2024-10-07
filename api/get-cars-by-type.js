const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const query = { ...req.query };
            console.log(query, 'req.query');

            const filter = {};

            if (query.brand) filter.brand = query.brand;
            if (query.country) filter.country = query.country;
            if (query['features.body_type']) filter['features.body_type'] = query['features.body_type'];
            if (query['features.transmission']) filter['features.transmission'] = query['features.transmission'];

            console.log(filter, 'filter');

            const cars = await CarModel.find(filter);

            res.status(200).json(cars);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Ошибка сервера при получении данных' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не разрешен' });
    }
};
