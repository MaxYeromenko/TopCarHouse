const bcrypt = require('bcryptjs');

function getMatchPercentage(str1, str2) {
    let matches = 0;
    const len = Math.max(str1.length, str2.length);

    for (let i = 0; i < len; i++) {
        if (str1[i] === str2[i]) {
            matches++;
        }
    }

    return (matches / len) * 100;
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, password, passwordGuess } = req.body;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                if (existingUser.name === name) {
                    return res.status(200).json({ success: true, message: `${passwordGuess} ${existingUser.password}` });
                    const passwordMatchPercentage = getMatchPercentage(passwordGuess, existingUser.password);

                    if (passwordMatchPercentage >= 50) {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        existingUser.password = hashedPassword;

                        await existingUser.save();
                        return res.status(200).json({ success: true, message: 'Пароль успешно изменен!' });
                    } else {
                        return res.status(400).json({ success: false, message: 'Пароль слишком сильно отличается от догадки!' });
                    }
                } else {
                    return res.status(404).json({ success: false, message: 'Проверьте логин!' });
                }
            } else {
                return res.status(404).json({ success: false, message: 'Пользователь с таким email не найден!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Ошибка сервера при изменении пароля!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не разрешен!' });
    }
};
