const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const productBrand = params.get('brand');
const productModel = params.get('model');
const productYear = params.get('year');
const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';
let productData;

document.addEventListener("DOMContentLoaded", () => {
    fetch(`/api/get-one-car?id=${productId}&brand=${productBrand}&model=${productModel}&year=${productYear}`)
        .then(response => response.json())
        .then(data => {
            productData = data;
            loadProductInfo();
        })
        .catch(error => console.error('Error fetching product data:', error));
});

function loadProductInfo() {
    document.title = `${productData.brand} ${productData.model} | TopCarHouse`;

    document.getElementById('product-name-year').textContent = `${productData.brand} ${productData.model} — ${productData.year}`;
    document.getElementById('product-price').textContent = `$${productData.price}`;

    const default_car_URL = `${cloudinaryURL}v1725616540/default_car.jpg`;
    let productImages = productData.images && productData.images.length > 0
        ? productData.images.map(image => image.startsWith('http') ? image : `${cloudinaryURL}${image}`)
        : [default_car_URL];

    const productImage = document.getElementById('product-image');
    productImage.loading = "lazy";

    const checkImageValidity = (imageUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => resolve(imageUrl);
            img.onerror = () => reject(imageUrl);
        });
    };

    Promise.all(productImages.map(imageUrl =>
        checkImageValidity(imageUrl).catch(() => default_car_URL)
    )).then(validImages => {
        if (validImages.length > 0) {
            productImage.src = validImages[0];
            document.getElementById('page-tracker').textContent = `1 / ${validImages.length}`;
        } else {
            productImage.src = default_car_URL;
        }

        let currentImageIndex = 0;

        const updateImage = () => {
            productImage.src = validImages[currentImageIndex];
            document.getElementById('page-tracker').textContent = `${currentImageIndex + 1} / ${validImages.length}`;
        };

        document.getElementById('slider-next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % validImages.length;
            updateImage();
        });

        document.getElementById('slider-prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + validImages.length) % validImages.length;
            updateImage();
        });
    });

    document.getElementById('product-description').textContent = `${productData.description}`;
    document.getElementById('product-brand').textContent = productData.brand;
    document.getElementById('product-model').textContent = productData.model;
    document.getElementById('product-year').textContent = productData.year;
    document.getElementById('product-color').textContent = productData.color;
    document.getElementById('product-transmission').textContent = productData.features.transmission;

    const engine = productData.features.engine;
    document.getElementById('product-engine').textContent = !isNaN(parseFloat(engine)) ? `${engine} л` : engine;

    document.getElementById('product-horsepower').textContent = `${productData.features.horsepower} к. с.`;
    document.getElementById('product-fuel-consumption').textContent =
        productData.features.fuel_consumption > 0 ? `${productData.features.fuel_consumption} л / 100 км` : '-';
    document.getElementById('product-fuel-type').textContent = productData.features.fuel_type;
};