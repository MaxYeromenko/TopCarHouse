const mongoose = require('../server/db');

const requestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    datetime: { type: Date, required: true }
});

const ConsultationModel = mongoose.model('Consultation', requestSchema);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, phone, datetime } = req.body;

        try {
            const newUser = new ConsultationModel({
                name,
                phone,
                datetime
            });

            await newUser.save();
            res.status(201).json({ success: true, message: 'Заява на консультацію успішно відправлена!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
            res.status(504).json({ error: 'Будь ласка, відправте дані ще раз або перезавантажте сторінку.' })
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
