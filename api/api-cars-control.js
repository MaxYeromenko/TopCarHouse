const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { brand, model, year, price, color, description, country, images, features } = req.body;

            if (!brand || !model || !year || !price || !color || !description || !country || !features) {
                return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі обов\'язкові поля.' });
            }

            const car = new CarModel({
                brand,
                model,
                year,
                price,
                color,
                description,
                country,
                images,
                features
            });

            await car.save();
            res.status(201).json({ success: true, message: 'Авто успішно додано!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час публікації!' });
        }
    }
    else if (req.method === 'GET') {
        try {
            const { id, ...query } = req.query;
            let filter = {};

            if (id) {
                filter._id = id;
            } else {
                if (query.brand) filter.brand = query.brand;
                if (query.model) filter.model = query.model;
                if (query.year) filter.year = Math.abs(Number(query.year));
                if (query.price) filter.price = { $lte: Math.abs(Number(query.price)) };
                if (query.color) filter.color = query.color;
                if (query.country) filter.country = query.country;

                if (query['features.horsepower']) filter['features.horsepower'] = { $lte: Math.abs(Number(query['features.horsepower'])) };
                if (query['features.transmission']) filter['features.transmission'] = query['features.transmission'];
                if (query['features.engine']) filter['features.engine'] = { $lte: Math.abs(Number(query['features.engine'])) };
                if (query['features.fuel_type']) filter['features.fuel_type'] = query['features.fuel_type'];
                if (query['features.fuel_consumption']) filter['features.fuel_consumption'] = { $lte: Math.abs(Number(query['features.fuel_consumption'])) };
                if (query['features.body_type']) filter['features.body_type'] = query['features.body_type'];
            }

            const cars = await CarModel.find(filter);
            res.status(200).json(cars);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
