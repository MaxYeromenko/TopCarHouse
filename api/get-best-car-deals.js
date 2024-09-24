const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const data = await CarModel.aggregate([
                {
                    $sort: { price: 1 }
                },
                {
                    $group: {
                        _id: { brand: "$brand", year: "$year" },
                        car: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$car" }
                },
                {
                    $sort: { brand: 1, year: -1 }
                }
            ]);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
            res.status(504).json({ success: false, message: 'Будь ласка, відправте дані ще раз або перезавантажте сторінку.' })
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
};
