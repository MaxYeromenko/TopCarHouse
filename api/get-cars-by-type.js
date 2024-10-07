const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const query = { ...req.query };
            const { brand, country, bodyType, transmission } = query;
            console.log(query, 'req.query');

            const filter = {};
            if (brand) filter.brand = brand;
            if (country) filter.country = country;
            if (bodyType) filter['features.body_type'] = bodyType;
            if (transmission) filter['features.transmission'] = transmission;
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
