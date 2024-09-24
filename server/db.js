const mongoose = require('mongoose');

const uri = 'mongodb+srv://user:6GkofFHyMXb1IlfI@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';

try {
    mongoose.connect(uri, {
        socketTimeoutMS: 15000,
        serverSelectionTimeoutMS: 10000
    });
    console.log("Connected to MongoDB Atlas!");
} catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
}

module.exports = mongoose;
