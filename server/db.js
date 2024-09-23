const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:pcvaP59lVECH028k@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';

mongoose.connect(uri, {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
