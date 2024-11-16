const mongoose = require('mongoose');
require('dotenv').config();

let isConnected;

const connectDB = async () => {
    if (isConnected) {
        console.log("Already connected to MongoDB Atlas.");
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
    country: String,
    images: [String],
    features: {
        transmission: String,
        engine: Number,
        fuel_type: String,
        horsepower: Number,
        fuel_consumption: Number,
        body_type: String
    }
});
const CarModel = mongoose.model('Car', CarSchema);

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const UserModel = mongoose.model('User', UserSchema);

const ConsultationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    datetime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'completed', 'cancelled'],
        default: 'new',
    },
});
const ConsultationModel = mongoose.model('Consultation', ConsultationSchema);

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    structure: [
        {
            elementType: String,
            elementContent: String
        }
    ],
    author: { type: String, required: true },
    tags: [{ type: String }],
    commentsEnabled: { type: Boolean, default: false },
    comments: [{
        commentator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        commentText: String,
        createdAt: { type: Date, default: Date.now }
    }],
    publishedDate: { type: Date, default: Date.now }
});
const BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

const PreOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    commentText: { type: String, default: '' },
    datetime: { type: Date, default: Date.now, required: true },
    status: {
        type: String,
        enum: ["new", "in-progress", "completed", "canceled"],
        default: "new",
        required: true
    }
});
const PreOrderModel = mongoose.model('PreOrder', PreOrderSchema);

module.exports = { mongoose, CarModel, UserModel, ConsultationModel, BlogPostModel, PreOrderModel };
