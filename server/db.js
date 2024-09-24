const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            socketTimeoutMS: 15000,
            serverSelectionTimeoutMS: 10000
        });
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        await mongoose.disconnect(); // Ждем завершения отключения
        process.exit(1); // Завершаем процесс с кодом 1
    }
};

module.exports = connectDB;
