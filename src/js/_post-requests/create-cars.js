const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:pcvaP59lVECH028k@topcarhouse.f44si.mongodb.net/topcarhousedb?retryWrites=true&w=majority&appName=TopCarHouse';
const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
    }
}

connectDB();

const cars = [
    {
        brand: "BMW",
        model: "X5",
        year: 2023,
        price: 60000,
        color: "Black",
        description: "Luxury SUV with advanced features",
        images: [
            `${cloudinaryURL}v1725822861/BMW_X5_FRONT_nlow9m.jpg`,
            `${cloudinaryURL}v1725823451/BMW_X5_FRONT_RIGHT_qnxfmt.jpg`,
            `${cloudinaryURL}v1725823450/BMW_X5_SIDE_a77bhx.jpg`,
            `${cloudinaryURL}v1725822762/BMW_X5_FRONT_LEFT_olfomi.jpg`,
            `${cloudinaryURL}v1725824183/BMW_X5_BACK_ujzogn.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "3.0",
            fuel_type: "Petrol",
            horsepower: 335,
            fuel_consumption: 10
        }
    },
    {
        brand: "Audi",
        model: "Q7",
        year: 2022,
        price: 58000,
        color: "White",
        description: "Premium SUV with high-end technology",
        images: [
            `${cloudinaryURL}v1725825392/AUDI_Q7_FRONT_towcvj.jpg`,
            `${cloudinaryURL}v1725825392/AUDI_Q7_FRONT_LEFT_cdy1xn.jpg`,
            `${cloudinaryURL}v1725825392/AUDI_Q7_SIDE_fxdhm3.jpg`,
            `${cloudinaryURL}v1725825391/AUDI_Q7_BACK_RIGHT_iz3wys.jpg`,
            `${cloudinaryURL}v1725825391/AUDI_Q7_BACK_agc8ax.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "3.0",
            fuel_type: "Diesel",
            horsepower: 333,
            fuel_consumption: 8
        }
    },
    {
        brand: "Mercedes-Benz",
        model: "GLE",
        year: 2023,
        price: 62000,
        color: "Silver",
        description: "Luxury SUV with comfortable interior",
        images: [
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_zbprlf.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_RIGHT_mdsizu.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_SIDE_ln29ix.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_LEFT_dbp9q6.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_BACK_qibgx3.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "2.9",
            fuel_type: "Diesel",
            horsepower: 362,
            fuel_consumption: 9
        }
    },
    {
        brand: "Tesla",
        model: "Model X",
        year: 2023,
        price: 85000,
        color: "Red",
        description: "Electric SUV with autopilot capabilities",
        images: [
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_mzjbgj.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_LEFT_gemyiu.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_SIDE_hebycm.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_RIGHT_gv90xa.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_BACK_rmcbc7.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "Electric",
            fuel_type: "Electric",
            horsepower: 670,
            fuel_consumption: 0
        }
    },
    {
        brand: "Lexus",
        model: "RX 350",
        year: 2021,
        price: 53000,
        color: "Blue",
        description: "Mid-size luxury SUV with smooth ride",
        images: [
            `${cloudinaryURL}v1725879046/LEXUS_RX350_FRONT_hd5az8.jpg`,
            `${cloudinaryURL}v1725879424/LEXUS_RX350_FRONT_RIGHT_w04lio.jpg`,
            `${cloudinaryURL}v1725879046/LEXUS_RX350_SIDE_z1huuc.jpg`,
            `${cloudinaryURL}v1725879423/LEXUS_RX350_FRONT_LEFT_o1sbgm.jpg`,
            `${cloudinaryURL}v1725879046/LEXUS_RX350_BACK_l2qnyh.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "3.5",
            fuel_type: "Petrol",
            horsepower: 295,
            fuel_consumption: 11
        }
    },
    {
        brand: "Volvo",
        model: "XC90",
        year: 2022,
        price: 55000,
        color: "Gray",
        description: "Safety-focused luxury SUV",
        images: [
            `${cloudinaryURL}v1725882507/VOLVO_XC90_FRONT_kbzgxe.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_SIDE_nmejrl.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_FRONT_LEFT_htgjgu.jpg`,
            `${cloudinaryURL}v1725883291/VOLVO_XC90_BACK_RIGHT_rurnme.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_BACK_aiwhdm.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "2.0",
            fuel_type: "Hybrid",
            horsepower: 400,
            fuel_consumption: 7
        }
    },
    {
        brand: "Porsche",
        model: "Cayenne",
        year: 2023,
        price: 75000,
        color: "Green",
        description: "High-performance SUV with sporty design",
        images: [
            `${cloudinaryURL}v1725884254/PORSHE_CAYENNE_FRONT_dhwlsd.jpg`,
            `${cloudinaryURL}v1725884444/PORSHE_CAYENNE_FRONT_RIGHT_alkcrs.jpg`,
            `${cloudinaryURL}v1725884255/PORSHE_CAYENNE_SIDE_dcxfyk.jpg`,
            `${cloudinaryURL}v1725884442/PORSHE_CAYENNE_FRONT_LEFT_hcfofl.jpg`,
            `${cloudinaryURL}v1725884589/PORSHE_CAYENNE_BACK_LEFT_hiecyn.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "3.0",
            fuel_type: "Petrol",
            horsepower: 335,
            fuel_consumption: 12
        }
    },
    {
        brand: "Jeep",
        model: "Grand Cherokee",
        year: 2022,
        price: 48000,
        color: "Black",
        description: "Off-road capable SUV with luxury features",
        images: [
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_FRONT_LEFT_pnsvub.jpg`,
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_FRONT_RIGHT_ywvfmq.jpg`,
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_SIDE_ym7pxa.jpg`,
            `${cloudinaryURL}v1725887645/JEEP_GRAND_CHEROKEE_BACK_LEFT_okyzia.jpg`,
            `${cloudinaryURL}v1725887643/JEEP_GRAND_CHEROKEE_BACK_RIGHT_krmmap.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "3.6",
            fuel_type: "Petrol",
            horsepower: 295,
            fuel_consumption: 13
        }
    },
    {
        brand: "Land Rover",
        model: "Range Rover",
        year: 2023,
        price: 90000,
        color: "White",
        description: "Iconic luxury SUV with all-terrain capabilities",
        images: [
            `${cloudinaryURL}v1725888363/LAND_ROVER_RANGE_ROVER_FRONT_v6taxi.jpg`,
            `${cloudinaryURL}v1725888359/LAND_ROVER_RANGE_ROVER_FRONT_RIGHT_ttpz0g.jpg`,
            `${cloudinaryURL}v1725888360/LAND_ROVER_RANGE_ROVER_SIDE_wwtcts.jpg`,
            `${cloudinaryURL}v1725888359/LAND_ROVER_RANGE_ROVER_FRONT_LEFT_vzpar1.jpg`,
            `${cloudinaryURL}v1725888362/LAND_ROVER_RANGE_ROVER_BACK_RIGHT_ovock2.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "5.0",
            fuel_type: "Petrol",
            horsepower: 518,
            fuel_consumption: 15
        }
    },
    {
        brand: "Ford",
        model: "Explorer",
        year: 2022,
        price: 46000,
        color: "Silver",
        description: "Spacious SUV with family-friendly features",
        images: [
            `${cloudinaryURL}v1725888785/FORD_EXPLORER_FRONT_sm9mxq.jpg`,
            `${cloudinaryURL}v1725888786/FORD_EXPLORER_FRONT_LEFT_vnly86.jpg`,
            `${cloudinaryURL}v1725888787/FORD_EXPLORER_SIDE_tene9t.jpg`,
            `${cloudinaryURL}v1725888786/FORD_EXPLORER_BACK_RIGHT_mj0fvn.jpg`,
            `${cloudinaryURL}v1725888788/FORD_EXPLORER_BACK_a9sgdw.jpg`,
        ],
        features: {
            transmission: "Automatic",
            engine: "2.3",
            fuel_type: "Petrol",
            horsepower: 300,
            fuel_consumption: 10
        }
    }
];

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

for (const carData of cars) {
    const car = new DataModel(carData);
    car.save()
        .then(() => console.log('Car added successfully!'))
        .catch((err) => console.log('Error adding car:', err));
}

