const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
