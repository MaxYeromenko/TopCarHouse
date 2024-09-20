const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';
const loadMoreButton = document.getElementById('load-more-cars');
let carsData = [];
let carsDisplayed = 0;
const carsPerPage = 24;
const retriesLimit = 3;

document.addEventListener("DOMContentLoaded", async () => {
    showMessage('Завантаження...', true);
    message.classList.remove('invisible');

    try {
        carsData = await fetchWithRetry('/api/get-all-cars', retriesLimit);
        loadMoreCars();
    } catch (error) {
        console.error('Error fetching cars data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }

    messageClose.onclick = () => {
        message.classList.add('invisible');
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    };
});

async function fetchWithRetry(url, retries) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 504) {
                    throw new Error('504 Gateway Timeout');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Попытка ${i + 1} из ${retries}: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

function loadMoreCars() {
    const carsContainer = document.getElementById('cars-container');
    const nextCars = carsData.slice(carsDisplayed, carsDisplayed + carsPerPage);

    nextCars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.classList.add('car');

        const default_car_URL = `${cloudinaryURL}v1725616540/default_car.jpg`;

        let carImages = car.images && car.images.length > 0
            ? car.images.map(image => image.startsWith('http') ? image : `${cloudinaryURL}${image}`)
            : [default_car_URL];

        let currentImageIndex = 0;
        let imageInterval;

        const carImageElement = document.createElement('img');
        carImageElement.classList.add('product-image');
        carImageElement.alt = `${car.brand} ${car.model}`;
        carImageElement.src = default_car_URL;

        const compareButton = document.createElement('button');
        compareButton.classList.add('compare-btn');
        compareButton.innerHTML = 'Порівняти <i class="fa-solid fa-scale-unbalanced"></i>';

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('product-image-container');
        imageContainer.appendChild(carImageElement);
        imageContainer.appendChild(compareButton);

        carCard.innerHTML = `
        <div class="product-card">
            <div class="product-info">
                <h2 class="product-title">${car.brand} ${car.model}</h2>
                <p class="product-description">
                    ${car.year}, ${car.features.engine}, ${car.features.fuel_type}, ${car.features.horsepower} к.с.
                </p>
                <div class="product-features">
                    <div class="feature">
                        <i class="fa-solid fa-gears"></i>${car.features.transmission}
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-gas-pump"></i> 
                        ${car.features.fuel_consumption > 0 ? car.features.fuel_consumption + ' л / 100 км' : ' - '} 
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-caravan"></i> ${car.features.horsepower} к.с.
                    </div>
                </div>
                <div class="product-price">Ціна: $${car.price}</div>
                <a href="/pages/product-info.html?id=${car._id}" class="product-button" target="_blank">
                    Детальніше <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </div>
        </div>`;

        checkValidImages(carImages, carImageElement, default_car_URL)
            .then(validImages => {
                setupImageSlider(validImages, carImageElement, carCard);
            });

        carsContainer.appendChild(carCard);
    });

    carsDisplayed += nextCars.length;

    if (carsDisplayed >= carsData.length) {
        loadMoreButton.style.display = 'none';
    }
}

loadMoreButton.addEventListener('click', loadMoreCars);

function checkValidImages(images, imageElement, defaultImageUrl) {
    const validImages = [];

    const checkImageValidity = (imageUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => resolve(imageUrl);
            img.onerror = () => resolve(defaultImageUrl);
        });
    };

    return Promise.all(images.map(imageUrl =>
        checkImageValidity(imageUrl)
    )).then(results => {
        results.forEach(validImage => {
            if (!validImages.includes(validImage)) validImages.push(validImage);
        });

        if (validImages.length > 0) {
            imageElement.src = validImages[0];
        } else {
            imageElement.src = defaultImageUrl;
        }
        return validImages;
    });
}

function setupImageSlider(validImages, imageElement, carCard) {
    let currentImageIndex = 0;
    let imageInterval;

    const changeImage = () => {
        currentImageIndex = (currentImageIndex + 1) % validImages.length;
        imageElement.src = validImages[currentImageIndex];
    };

    carCard.addEventListener('mouseenter', () => {
        if (validImages.length > 1) {
            imageInterval = setInterval(changeImage, 1500);
        }
    });

    carCard.addEventListener('mouseleave', () => {
        clearInterval(imageInterval);
        if (validImages.length > 0) {
            imageElement.src = validImages[0];
        }
    });
}
