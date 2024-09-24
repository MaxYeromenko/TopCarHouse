const mongoose = require('mongoose');

// const uri = 'mongodb+srv://root:pcvaP59lVECH028k@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';
const uri = `mongodb://root:pcvaP59lVECH028k@topcarhouse-shard-00-00.puton.mongodb.net:27017,topcarhouse-shard-00-01.puton.mongodb.net:27017,topcarhouse-shard-00-02.puton.mongodb.net:27017/topcarhousedb`;

try {
    mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas!");
} catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
}

module.exports = mongoose;
