const mongoose = require('../server/db');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Користувач з такою поштою вже існує!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save();
            res.status(201).json({ success: true, message: 'Користувач успішно зареєстрованний!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
            res.status(504).json({ success: false, error: 'Будь ласка, відправте дані ще раз або перезавантажте сторінку.' })
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};
