const mongoose = require('../server/db');

const DataSchema = new mongoose.Schema({
    brand: { type: String, index: true },
    model: { type: String, index: true },
    year: { type: Number, index: true },
    price: Number,
    color: String,
    description: String,
    images: [String],
    features: {
        transmission: String,
        engine: String,
        fuel_type: String,
        horsepower: Number,
        fuel_consumption: Number
    }
});

// Композитный индекс для ускорения поиска по нескольким полям
DataSchema.index({ brand: 1, model: 1, year: 1 });

const DataModel = mongoose.model('Car', DataSchema);

module.exports = async (req, res) => {
    const { id, brand, model, year } = req.query;

    if (req.method === 'GET') {
        try {
            const searchCriteria = {};

            if (id) {
                searchCriteria._id = id;
            }

            if (brand) {
                searchCriteria.brand = brand;
            }

            if (model) {
                searchCriteria.model = model;
            }

            if (year) {
                searchCriteria.year = year;
            }

            // Используем lean для ускорения
            const car = await DataModel.findOne(searchCriteria).lean();
            res.status(200).json(car);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
            res.status(504).json({ success: false, message: 'Будь ласка, відправте дані ще раз або перезавантажте сторінку.' })
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};
