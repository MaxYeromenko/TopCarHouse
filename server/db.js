const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    poolSize: 20,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Успешно подключились к MongoDB'))
    .catch(err => console.error('Ошибка подключения к MongoDB:', err));

module.exports = mongoose;