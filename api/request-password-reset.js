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
            const resetLink = `https://top-car-house.vercel.app/pages/reset-password.html?token=${resetToken}`;

            await sendEmail(
                email,
                'Скидання пароля',
                `Привіт! Для скидання пароля перейдіть за посиланням: ${resetLink}. Воно буде активним протягом 10 хвилин.`,
                `Привіт!<br><br>
                Для скидання пароля перейдіть за <a href="${resetLink}">цим посиланням</a>. Воно буде активним протягом 10 хвилин. Якщо ви не запитували скидання пароля, просто проігноруйте цей лист.<br><br>
                Якщо у вас виникли питання, звертайтесь до нашої підтримки: topcarhouse313@gmail.com.<br><br>
                Дякуємо!`
            );

            res.status(200).json({ success: true, message: 'Листа для скидання пароля відправлено!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час відправки листа!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};