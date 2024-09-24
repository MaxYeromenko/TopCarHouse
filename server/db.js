const mongoose = require('mongoose');

let isConnected;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            socketTimeoutMS: 15000,
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10
        });
        isConnected = true;
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        process.exit(1);
    }
};

connectDB();

const CarSchema = new mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
    price: Number,
    color: String,
    description: String,
    images: [String],
    features: {
        transmission: String,
        engine: String,
        fuel_type: String,
        horsepower: Number,
        fuel_consumption: Number
    }
});

const CarModel = mongoose.model('Car', CarSchema);

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

const ConsultationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    datetime: { type: Date, required: true }
});

const ConsultationModel = mongoose.model('Consultation', ConsultationSchema);

module.exports = { mongoose, CarModel, UserModel, ConsultationModel };
