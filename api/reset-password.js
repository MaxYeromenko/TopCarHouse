const { UserModel } = require('../server/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувач з такою поштою не існує!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        await user.save();
        res.status(200).json({ success: true, message: 'Пароль успішно змінено!' });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'Термін дії токена скінчився! Будь ласка, запитайте дозвіл на скидання пароля ще раз.' });
        }
        res.status(500).json({ success: false, message: 'Помилка сервера під час заміни пароля!' });
    }
};
