const { TestDriveModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { testDriveId, id, name, email, phone, car, commentText } = req.body;

        try {
            if (testDriveId) {
                const testDrive = await TestDriveModel.findById(testDriveId);
                if (!testDrive) {
                    return res.status(404).json({ success: false, message: 'Запис не знайдено!' });
                }

                testDrive.status = 'cancelled';
                await testDrive.save();

                return res.status(201).json({ success: true, message: 'Статус запису успішно змінено на "Скасовано"!' });
            }

            const newTestDrive = new TestDriveModel({
                userId: id,
                name,
                email,
                phone,
                car,
                commentText
            });

            await newTestDrive.save();
            res.status(201).json({ success: true, message: 'Заява на тест-драйв успішно відправлена!' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
        }
    } else if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID користувача обов’язковий!' });
        }

        try {
            const testDrives = await TestDriveModel.find({ userId: id }).populate('car', 'brand model');
            res.status(200).json(testDrives);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
