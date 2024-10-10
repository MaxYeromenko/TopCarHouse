const { CarModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const cars = await CarModel.find({}, 'brand model color country features.body_type features.transmission features.fuel_type');

            const brands = [...new Set(cars.map(car => car.brand))];
            const models = [...new Set(cars.map(car => car.model))];
            const colors = [...new Set(cars.map(car => car.color))]; 
            const countries = [...new Set(cars.map(car => car.country))]; 
            const bodyTypes = [...new Set(cars.map(car => car.features.body_type))];
            const transmissions = [...new Set(cars.map(car => car.features.transmission))];
            const fuelTypes = [...new Set(cars.map(car => car.features.fuel_type))];

            res.status(200).json({
                brands,
                models,
                colors,
                countries,
                bodyTypes,
                transmissions,
                fuelTypes
            });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
