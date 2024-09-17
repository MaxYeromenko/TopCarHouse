const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

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
