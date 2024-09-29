const cardsSection = document.querySelector('.cards-section');
const carsContainer = document.createElement('div');
carsContainer.className = 'cars-container';
cardsSection.appendChild(carsContainer);
const cardsSectionButtons = document.createElement('div');
cardsSectionButtons.className = '.cards-section-buttons';
cardsSection.appendChild(cardsSectionButtons);
const loadMoreCarsButton = document.createElement('button');
loadMoreCarsButton.textContent = 'Завантажити більше';
cardsSectionButtons.appendChild(loadMoreCarsButton);

let carsData = [];
let carsDisplayed = 0;
const carsPerPage = 8;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await fetchWithRetry('/api/get-best-car-deals', retriesLimit);

        if (result) {
            carsData = result;
            loadMoreCars();
        }
    } catch (error) {
        console.error('Error fetching cars data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

function loadMoreCars() {
    const nextCars = carsData.slice(carsDisplayed, carsDisplayed + carsPerPage);

    nextCars.forEach(car => {
        const carCard = createCarCard(car);
        carsContainer.appendChild(carCard);
    });

    carsDisplayed += nextCars.length;

    if (carsDisplayed >= carsData.length) toggleElementVisibility(loadMoreCarsButton, 'none');
}

function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.classList.add('car');

    let carImages = car.images && car.images.length > 0
        ? car.images.map(image => image.startsWith('http') ? image : `${cloudinaryURL}${image}`)
        : [default_car_URL];

    let currentImageIndex = 0;
    let validImages = [];
    let imageInterval;

    const carImageElement = document.createElement('img');
    carImageElement.classList.add('product-image');
    carImageElement.alt = `${car.brand} ${car.model}`;
    carImageElement.src = default_car_URL;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('product-image-container');
    imageContainer.appendChild(carImageElement);

    const compareButton = document.createElement('button');
    compareButton.setAttribute('data-id', car._id);
    compareButton.classList.add('compare-btn');
    compareButton.innerHTML = 'Порівняти <i class="fa-solid fa-scale-unbalanced"></i>';
    imageContainer.appendChild(compareButton);

    compareButton.addEventListener('click', function () {
        const carId = this.getAttribute('data-id');
        addToCarToLocalStorage(carId);
    });

    carCard.innerHTML = `
    <div class="product-card">
        <div class="product-info">
            <h2 class="product-title">${car.brand} ${car.model}</h2>
            <p class="product-description">
                ${car.year}, ${car.features.engine}, ${car.features.fuel_type}, ${car.features.horsepower} к.с.
            </p>
            <div class="product-features">
                <div class="feature"><i class="fa-solid fa-gears"></i>${car.features.transmission}</div>
                <div class="feature"><i class="fa-solid fa-gas-pump"></i>${car.features.fuel_consumption > 0 ? car.features.fuel_consumption + ' л / 100 км' : ' - '}</div>
                <div class="feature"><i class="fa-solid fa-caravan"></i>${car.features.horsepower} к.с.</div>
            </div>
            <div class="product-price">Ціна: $${car.price}</div>
            <a href="/pages/product-info.html?id=${car._id}" target="_blank">
                Детальніше <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <div class="product-footer">Найкращі умови купівлі!</div>
        </div>
    </div>`;

    carImages.forEach(imageUrl => {
        checkImageValidity(imageUrl)
            .then(validImageUrl => {
                validImages.push(validImageUrl);
                if (validImages.length === 1) {
                    carImageElement.src = validImages[0];
                }
            })
            .catch(() => console.warn(`Image ${imageUrl} is broken and will be removed.`));
    });

    carCard.querySelector('.product-card').insertBefore(imageContainer, carCard.querySelector('.product-info'));

    const changeImage = () => {
        currentImageIndex = (currentImageIndex + 1) % validImages.length;
        carImageElement.src = validImages[currentImageIndex];
    };

    carCard.addEventListener('mouseenter', () => {
        if (validImages.length > 1) imageInterval = setInterval(changeImage, 1500);
    });

    carCard.addEventListener('mouseleave', () => {
        clearInterval(imageInterval);
        if (validImages.length > 0) carImageElement.src = validImages[0];
    });

    return carCard;
}

loadMoreCarsButton.addEventListener('click', loadMoreCars);
