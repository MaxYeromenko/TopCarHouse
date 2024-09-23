const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://user:TtGHeh6JZfcCkSNE@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';

mongoose.connect(uri, {
    maxPoolSize: 500,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
