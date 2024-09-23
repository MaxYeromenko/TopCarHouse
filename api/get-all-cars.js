const DataSchema = new connectionToDB.Schema({
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

const DataModel = connectionToDB.model('Car', DataSchema);

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const data = await DataModel.find();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
            res.status(504).json({ success: false, message: 'Будь ласка, відправте дані ще раз або перезавантажте сторінку.' })
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
};
