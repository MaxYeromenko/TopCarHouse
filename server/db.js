const mongoose = require('mongoose');
const uri = `mongodb://root:pcvaP59lVECH028k@topcarhouse-shard-00-00.f44si.mongodb.net:27017,topcarhouse-shard-00-01.f44si.mongodb.net:27017,topcarhouse-shard-00-02.f44si.mongodb.net:27017/topcarhousedb?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority`;

try {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas!");
} catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
}

module.exports = mongoose;

