const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 100,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
