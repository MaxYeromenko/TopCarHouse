const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
const uri = 'mongodb+srv://root:cJkEHMc9b81zcyZv@topcarhouse.puton.mongodb.net/?retryWrites=true&w=majority&appName=TopCarHouse';

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
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
        res.status(500).json({ success: false, message: 'Помилка сервера під час реєстрації!' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
