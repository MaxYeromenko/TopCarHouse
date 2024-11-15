const { PreOrderModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { orderId, name, email, phone, car, commentText } = req.body;

        try {
            if (orderId) {
                const order = await PreOrderModel.findById(orderId);
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Замовлення не знайдено!' });
                }

                order.status = 'canceled';
                await order.save();

                return res.status(200).json({ success: true, message: 'Статус замовлення успішно змінено на "Скасовано"!' });
            }

            const newPreOrder = new PreOrderModel({
                userId: id,
                name,
                email,
                phone,
                car,
                commentText
            });

            await newPreOrder.save();
            res.status(201).json({ success: true, message: 'Заява на передзамовлення успішно відправлена!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
        }
    } else if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID користувача обов’язковий!' });
        }

        try {
            const preOrders = await PreOrderModel.find({ userId: id });
            res.status(200).json(preOrders);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
