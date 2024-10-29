const { UserModel } = require('../server/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, password, role } = req.body;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Користувач з такою поштою вже існує!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                role
            });

            await newUser.save();
            res.status(201).json({ success: true, message: 'Користувач успішно зареєстрованний!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};
