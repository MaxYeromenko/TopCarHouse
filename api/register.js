const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

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
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений' });
    }
};
