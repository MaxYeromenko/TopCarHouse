const { ConsultationModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { id, name, phone, datetime } = req.body;

        try {
            const newUser = new ConsultationModel({
                userId: id,
                name,
                phone,
                datetime
            });

            await newUser.save();
            res.status(201).json({ success: true, message: 'Заява на консультацію успішно відправлена!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
