const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { poolSize: 10, serverSelectionTimeoutMS: 5000 }).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;