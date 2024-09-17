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
    if (req.method === 'GET') {
        try {
            const data = await DataModel.find();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
