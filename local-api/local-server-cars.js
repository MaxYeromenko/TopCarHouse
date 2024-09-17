const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

mongoose.connect('mongodb+srv://root:cJkEHMc9b81zcyZv@topcarhouse.puton.mongodb.net/?retryWrites=true&w=majority&appName=TopCarHouse')
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    }).catch(err => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

const DataSchema = new mongoose.Schema({
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

const DataModel = mongoose.model('Car', DataSchema);

app.get('/cars', async (req, res) => {
    try {
        const data = await DataModel.find();
        console.log('Data fetched from MongoDB:', data);
        if (data.length === 0) {
            console.log('No data found');
            return res.status(404).send('No data found');
        }
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
