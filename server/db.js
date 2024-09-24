const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:pcvaP59lVECH028k@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';

const connectDB = () => {
    try {
        mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
