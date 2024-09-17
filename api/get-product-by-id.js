const mongoose = require('../server/db');

const DataSchema = new mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
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

            const car = await DataModel.findOne(searchCriteria);
            res.status(200).json(car);
        } catch (err) {
            res.status(500).json({ error: 'Error fetching car data' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};