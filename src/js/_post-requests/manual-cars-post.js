const { CarModel } = require('../../../server/db');

const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';

const cars = [
    {
        brand: "Land Rover",
        model: "Range Rover",
        year: 2023,
        price: 90000,
        color: "Білий",
        description: "Іконічний розкішний позашляховик з можливостями для будь-якої місцевості",
        country: "Великобританія",
        images: [
            `${cloudinaryURL}v1725888363/LAND_ROVER_RANGE_ROVER_FRONT_v6taxi.jpg`,
            `${cloudinaryURL}v1725888359/LAND_ROVER_RANGE_ROVER_FRONT_RIGHT_ttpz0g.jpg`,
            `${cloudinaryURL}v1725888360/LAND_ROVER_RANGE_ROVER_SIDE_wwtcts.jpg`,
            `${cloudinaryURL}v1725888359/LAND_ROVER_RANGE_ROVER_FRONT_LEFT_vzpar1.jpg`,
            `${cloudinaryURL}v1725888362/LAND_ROVER_RANGE_ROVER_BACK_RIGHT_ovock2.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 5.0,
            fuel_type: "Бензин",
            horsepower: 518,
            fuel_consumption: 15,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Ford",
        model: "Explorer",
        year: 2022,
        price: 46000,
        color: "Срібний",
        description: "Просторий позашляховик з сімейними функціями",
        country: "США",
        images: [
            `${cloudinaryURL}v1725888785/FORD_EXPLORER_FRONT_sm9mxq.jpg`,
            `${cloudinaryURL}v1725888786/FORD_EXPLORER_FRONT_LEFT_vnly86.jpg`,
            `${cloudinaryURL}v1725888787/FORD_EXPLORER_SIDE_tene9t.jpg`,
            `${cloudinaryURL}v1725888786/FORD_EXPLORER_BACK_RIGHT_mj0fvn.jpg`,
            `${cloudinaryURL}v1725888788/FORD_EXPLORER_BACK_a9sgdw.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.3,
            fuel_type: "Бензин",
            horsepower: 300,
            fuel_consumption: 10,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "BMW",
        model: "X5",
        year: 2023,
        price: 60000,
        color: "Чорний",
        description: "Розкішний позашляховик з передовими функціями",
        country: "Німеччина",
        images: [
            `${cloudinaryURL}v1725822861/BMW_X5_FRONT_nlow9m.jpg`,
            `${cloudinaryURL}v1725823451/BMW_X5_FRONT_RIGHT_qnxfmt.jpg`,
            `${cloudinaryURL}v1725823450/BMW_X5_SIDE_a77bhx.jpg`,
            `${cloudinaryURL}v1725822762/BMW_X5_FRONT_LEFT_olfomi.jpg`,
            `${cloudinaryURL}v1725824183/BMW_X5_BACK_ujzogn.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 3.0,
            fuel_type: "Бензин",
            horsepower: 335,
            fuel_consumption: 10,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Audi",
        model: "Q7",
        year: 2022,
        price: 58000,
        color: "Білий",
        description: "Преміум позашляховик з високими технологіями",
        country: "Німеччина",
        images: [
            `${cloudinaryURL}v1725825392/AUDI_Q7_FRONT_towcvj.jpg`,
            `${cloudinaryURL}v1725825392/AUDI_Q7_FRONT_LEFT_cdy1xn.jpg`,
            `${cloudinaryURL}v1725825392/AUDI_Q7_SIDE_fxdhm3.jpg`,
            `${cloudinaryURL}v1725825391/AUDI_Q7_BACK_RIGHT_iz3wys.jpg`,
            `${cloudinaryURL}v1725825391/AUDI_Q7_BACK_agc8ax.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 3.0,
            fuel_type: "Дизель",
            horsepower: 333,
            fuel_consumption: 8,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Mercedes-Benz",
        model: "GLE",
        year: 2023,
        price: 62000,
        color: "Срібний",
        description: "Розкішний позашляховик з комфортним інтер'єром",
        country: "Німеччина",
        images: [
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_zbprlf.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_RIGHT_mdsizu.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_SIDE_ln29ix.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_FRONT_LEFT_dbp9q6.jpg`,
            `${cloudinaryURL}v1725878169/MERCEDES_BENZ_GLE_BACK_qibgx3.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.9,
            fuel_type: "Дизель",
            horsepower: 362,
            fuel_consumption: 9,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Tesla",
        model: "Model X",
        year: 2023,
        price: 85000,
        color: "Червоний",
        description: "Електричний позашляховик з функцією автопілоту",
        country: "США",
        images: [
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_mzjbgj.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_LEFT_gemyiu.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_SIDE_hebycm.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_FRONT_RIGHT_gv90xa.jpg`,
            `${cloudinaryURL}v1725889727/TESLA_X_BACK_rmcbc7.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: "Електричний",
            fuel_type: "Електро",
            horsepower: 670,
            fuel_consumption: 0,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Lexus",
        model: "RX 350",
        year: 2021,
        price: 53000,
        color: "Синій",
        description: "Середньорозмірний розкішний позашляховик з плавною їздою",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725879046/LEXUS_RX350_FRONT_hd5az8.jpg`,
            `${cloudinaryURL}v1725879424/LEXUS_RX350_FRONT_RIGHT_w04lio.jpg`,
            `${cloudinaryURL}v1725879046/LEXUS_RX350_SIDE_z1huuc.jpg`,
            `${cloudinaryURL}v1725879423/LEXUS_RX350_FRONT_LEFT_o1sbgm.jpg`,
            `${cloudinaryURL}v1725879046/LEXUS_RX350_BACK_l2qnyh.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 3.5,
            fuel_type: "Бензин",
            horsepower: 295,
            fuel_consumption: 11,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Volvo",
        model: "XC90",
        year: 2022,
        price: 55000,
        color: "Сірий",
        description: "Позашляховик класу люкс з акцентом на безпеку",
        country: "Швеція",
        images: [
            `${cloudinaryURL}v1725882507/VOLVO_XC90_FRONT_kbzgxe.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_SIDE_nmejrl.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_FRONT_LEFT_htgjgu.jpg`,
            `${cloudinaryURL}v1725883291/VOLVO_XC90_BACK_RIGHT_rurnme.jpg`,
            `${cloudinaryURL}v1725882508/VOLVO_XC90_BACK_aiwhdm.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.0,
            fuel_type: "Гібрид",
            horsepower: 400,
            fuel_consumption: 7,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Porsche",
        model: "Cayenne",
        year: 2023,
        price: 75000,
        color: "Зелений",
        description: "Високопродуктивний позашляховик зі спортивним дизайном",
        country: "Німеччина",
        images: [
            `${cloudinaryURL}v1725884254/PORSHE_CAYENNE_FRONT_dhwlsd.jpg`,
            `${cloudinaryURL}v1725884444/PORSHE_CAYENNE_FRONT_RIGHT_alkcrs.jpg`,
            `${cloudinaryURL}v1725884255/PORSHE_CAYENNE_SIDE_dcxfyk.jpg`,
            `${cloudinaryURL}v1725884442/PORSHE_CAYENNE_FRONT_LEFT_hcfofl.jpg`,
            `${cloudinaryURL}v1725884589/PORSHE_CAYENNE_BACK_LEFT_hiecyn.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 3.0,
            fuel_type: "Бензин",
            horsepower: 335,
            fuel_consumption: 12,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Jeep",
        model: "Grand Cherokee",
        year: 2022,
        price: 48000,
        color: "Чорний",
        description: "Позашляховик з розкішними можливостями для бездоріжжя",
        country: "США",
        images: [
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_FRONT_LEFT_pnsvub.jpg`,
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_FRONT_RIGHT_ywvfmq.jpg`,
            `${cloudinaryURL}v1725887642/JEEP_GRAND_CHEROKEE_SIDE_ym7pxa.jpg`,
            `${cloudinaryURL}v1725887645/JEEP_GRAND_CHEROKEE_BACK_LEFT_okyzia.jpg`,
            `${cloudinaryURL}v1725887643/JEEP_GRAND_CHEROKEE_BACK_RIGHT_krmmap.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 3.6,
            fuel_type: "Бензин",
            horsepower: 295,
            fuel_consumption: 13,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Toyota",
        model: "Camry",
        year: 2023,
        price: 30000,
        color: "Чорний",
        description: "Седан з надійністю і комфортом",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725889799/TOYOTA_CAMRY_FRONT.jpg`,
            `${cloudinaryURL}v1725889801/TOYOTA_CAMRY_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889800/TOYOTA_CAMRY_SIDE.jpg`,
            `${cloudinaryURL}v1725889800/TOYOTA_CAMRY_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889801/TOYOTA_CAMRY_BACK.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 203,
            fuel_consumption: 7,
            body_type: "Седан"
        }
    },
    {
        brand: "Honda",
        model: "Civic",
        year: 2022,
        price: 24000,
        color: "Червоний",
        description: "Економічний та стильний хетчбек",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725889795/HONDA_CIVIC_FRONT.jpg`,
            `${cloudinaryURL}v1725889796/HONDA_CIVIC_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889797/HONDA_CIVIC_SIDE.jpg`,
            `${cloudinaryURL}v1725889798/HONDA_CIVIC_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889799/HONDA_CIVIC_BACK.jpg`,
        ],
        features: {
            transmission: "Механічна",
            engine: 1.5,
            fuel_type: "Бензин",
            horsepower: 180,
            fuel_consumption: 6,
            body_type: "Хетчбек"
        }
    },
    {
        brand: "Chevrolet",
        model: "Tahoe",
        year: 2023,
        price: 67000,
        color: "Білий",
        description: "Повнорозмірний позашляховик з потужним двигуном",
        country: "США",
        images: [
            `${cloudinaryURL}v1725889911/CHEVROLET_TAHOE_FRONT.jpg`,
            `${cloudinaryURL}v1725889913/CHEVROLET_TAHOE_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889912/CHEVROLET_TAHOE_SIDE.jpg`,
            `${cloudinaryURL}v1725889914/CHEVROLET_TAHOE_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889915/CHEVROLET_TAHOE_BACK.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 6.2,
            fuel_type: "Бензин",
            horsepower: 420,
            fuel_consumption: 14,
            body_type: "Позашляховик"
        }
    },
    {
        brand: "Volkswagen",
        model: "Golf",
        year: 2022,
        price: 27000,
        color: "Синій",
        description: "Компактний хетчбек з відмінною економією пального",
        country: "Німеччина",
        images: [
            `${cloudinaryURL}v1725889811/VOLKSWAGEN_GOLF_FRONT.jpg`,
            `${cloudinaryURL}v1725889812/VOLKSWAGEN_GOLF_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889813/VOLKSWAGEN_GOLF_SIDE.jpg`,
            `${cloudinaryURL}v1725889814/VOLKSWAGEN_GOLF_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889815/VOLKSWAGEN_GOLF_BACK.jpg`,
        ],
        features: {
            transmission: "Механічна",
            engine: 1.4,
            fuel_type: "Бензин",
            horsepower: 147,
            fuel_consumption: 5,
            body_type: "Хетчбек"
        }
    },
    {
        brand: "Mazda",
        model: "CX-5",
        year: 2023,
        price: 40000,
        color: "Сірий",
        description: "Компактний кросовер з відмінною керованістю",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725889871/MAZDA_CX5_FRONT.jpg`,
            `${cloudinaryURL}v1725889872/MAZDA_CX5_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889873/MAZDA_CX5_SIDE.jpg`,
            `${cloudinaryURL}v1725889874/MAZDA_CX5_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889875/MAZDA_CX5_BACK.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 187,
            fuel_consumption: 8,
            body_type: "Кросовер"
        }
    },
    {
        brand: "Hyundai",
        model: "Sonata",
        year: 2022,
        price: 27000,
        color: "Синій",
        description: "Місткий седан з сучасним дизайном",
        country: "Південна Корея",
        images: [
            `${cloudinaryURL}v1725889955/HYUNDAI_SONATA_FRONT.jpg`,
            `${cloudinaryURL}v1725889957/HYUNDAI_SONATA_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725889956/HYUNDAI_SONATA_SIDE.jpg`,
            `${cloudinaryURL}v1725889958/HYUNDAI_SONATA_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725889959/HYUNDAI_SONATA_BACK.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 191,
            fuel_consumption: 7,
            body_type: "Седан"
        }
    },
    {
        brand: "Subaru",
        model: "Outback",
        year: 2023,
        price: 39000,
        color: "Зелений",
        description: "Універсал з можливостями для бездоріжжя",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725890032/SUBARU_OUTBACK_FRONT.jpg`,
            `${cloudinaryURL}v1725890033/SUBARU_OUTBACK_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725890034/SUBARU_OUTBACK_SIDE.jpg`,
            `${cloudinaryURL}v1725890035/SUBARU_OUTBACK_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725890036/SUBARU_OUTBACK_BACK.jpg`,
        ],
        features: {
            transmission: "Варіатор",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 182,
            fuel_consumption: 8,
            body_type: "Універсал"
        }
    },
    {
        brand: "Kia",
        model: "Sorento",
        year: 2023,
        price: 42000,
        color: "Сірий",
        description: "Сімейний кросовер з простором для 7 пасажирів",
        country: "Південна Корея",
        images: [
            `${cloudinaryURL}v1725890071/KIA_SORENTO_FRONT.jpg`,
            `${cloudinaryURL}v1725890072/KIA_SORENTO_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725890073/KIA_SORENTO_SIDE.jpg`,
            `${cloudinaryURL}v1725890074/KIA_SORENTO_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725890075/KIA_SORENTO_BACK.jpg`,
        ],
        features: {
            transmission: "Автоматична",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 281,
            fuel_consumption: 9,
            body_type: "Кросовер"
        }
    },
    {
        brand: "Nissan",
        model: "Altima",
        year: 2023,
        price: 29000,
        color: "Чорний",
        description: "Стильний седан з високим рівнем комфорту",
        country: "Японія",
        images: [
            `${cloudinaryURL}v1725890155/NISSAN_ALTIMA_FRONT.jpg`,
            `${cloudinaryURL}v1725890156/NISSAN_ALTIMA_FRONT_LEFT.jpg`,
            `${cloudinaryURL}v1725890157/NISSAN_ALTIMA_SIDE.jpg`,
            `${cloudinaryURL}v1725890158/NISSAN_ALTIMA_BACK_LEFT.jpg`,
            `${cloudinaryURL}v1725890159/NISSAN_ALTIMA_BACK.jpg`,
        ],
        features: {
            transmission: "Варіатор",
            engine: 2.5,
            fuel_type: "Бензин",
            horsepower: 188,
            fuel_consumption: 8,
            body_type: "Седан"
        }
    }
];

for (const carData of cars) {
    const car = new CarModel(carData);
    car.save()
        .then(() => console.log('Car added successfully!'))
        .catch((err) => console.log('Error adding car:', err));
}