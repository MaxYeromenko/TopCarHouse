const { ConsultationModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { consultationId, id, name, phone, datetime } = req.body;

        try {
            if (consultationId) {
                const consultation = await ConsultationModel.findById(consultationId);
                if (!consultation) {
                    return res.status(404).json({ success: false, message: 'Консультацію не знайдено!' });
                }

                consultation.status = 'cancelled';
                await consultation.save();

                return res.status(201).json({ success: true, message: 'Статус консультації успішно змінено на "Скасовано"!' });
            }

            const newUser = new ConsultationModel({
                userId: id,
                name,
                phone,
                datetime
            });

            await newUser.save();
            res.status(201).json({ success: true, message: 'Заява на консультацію успішно відправлена!' });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ success: false, message: `Помилка сервера під час реєстрації!` });
        }
    } else if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID користувача обов’язковий!' });
        }

        try {
            const consultations = await ConsultationModel.find({ userId: id });
            res.status(200).json(consultations);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
