const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
