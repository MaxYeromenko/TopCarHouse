const { UserModel } = require('../server/db');
const jwt = require('jsonwebtoken');
const sendEmail = require('../mail/sendEmail');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Користувач з такою поштою не існує!' });
            }

            const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
            const resetLink = `https://top-car-house.vercel.app/pages/reset-password?token=${resetToken}`;

            await sendEmail(email, 'Скидання пароля', `Для скидання пароля перейдіть за посиланням: ${resetLink}`);

            res.status(200).json({ success: true, message: 'Листа для скидання пароля відправлено!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час відправки листа!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};
