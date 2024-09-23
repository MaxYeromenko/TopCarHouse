const mongoose = require('mongoose');

mongoose.connect('mongodb://root:pcvaP59lVECH028k@topcarhouse-shard-00-00.f44si.mongodb.net:27017,topcarhouse-shard-00-01.f44si.mongodb.net:27017,topcarhouse-shard-00-02.f44si.mongodb.net:27017/topcarhousedb?retryWrites=true&w=majority', {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
