const { PreOrderModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, phone, car, commentText } = req.body;

        try {
            const newPreOrder = new PreOrderModel({
                name,
                email,
                phone,
                car,
                commentText
            });

            await newPreOrder.save();
            res.status(201).json({ success: true, message: 'Заява на консультацію успішно відправлена!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
