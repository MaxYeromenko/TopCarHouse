const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:pcvaP59lVECH028k@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';

try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas!");
} catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
}

module.exports = mongoose;
