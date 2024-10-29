const { UserModel } = require('../server/db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const secret = process.env.JWT_SECRET;

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Неправильний email або пароль' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Неправильний email або пароль' });
            }

            const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn: '3d' });

            res.status(200).json({ success: true, token, message: 'Ви увійшли до облікового запису!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час входу!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
