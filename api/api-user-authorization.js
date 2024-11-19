const { UserModel } = require('../server/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }

    const { name, email, password, role } = req.body;

    try {
        if (name && email && password && role) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Користувач з такою поштою вже існує!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                role,
            });

            await newUser.save();
            return res.status(201).json({ success: true, message: 'Користувач успішно зареєстрованний!' });
        } else if (email && password) {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Неправильний email або пароль' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Неправильний email або пароль' });
            }

            const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn: '3d' });

            return res.status(200).json({ success: true, token, message: 'Ви увійшли до облікового запису!' });
        } else {
            return res.status(400).json({ success: false, message: 'Неправильні параметри запиту' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Помилка сервера!' });
    }
};
