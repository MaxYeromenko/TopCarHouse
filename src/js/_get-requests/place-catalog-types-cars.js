const catalogSection = document.querySelector('.catalog');
const filterSectionOpen = document.getElementById('filter-section-open');
const filterContainer = document.getElementById('filter-container');
const carFilterForm = filterContainer.querySelector('form');
const countryList = catalogSection.querySelector('#country-list');
const brandList = catalogSection.querySelector('#brand-list');
const bodyTypeList = catalogSection.querySelector('#body-type-list');
const transmissionList = catalogSection.querySelector('#transmission-list');

const catalogGrid = catalogSection.querySelector('.catalog-grid');
const cardsSection = catalogSection.querySelector('.cards-section');
const carsContainer = document.createElement('div');
carsContainer.className = 'cars-container';
cardsSection.appendChild(carsContainer);

const cardsSectionButtons = document.createElement('div');
cardsSectionButtons.className = 'cards-section-buttons';
cardsSection.appendChild(cardsSectionButtons);

const loadMoreCarsButton = document.createElement('button');
loadMoreCarsButton.textContent = 'Завантажити більше';
loadMoreCarsButton.style.display = 'none';
cardsSectionButtons.appendChild(loadMoreCarsButton);

const goToHomePage = document.createElement('a');
goToHomePage.href = '/';
goToHomePage.textContent = 'На головну';
cardsSectionButtons.appendChild(goToHomePage);

let catalogTypes = [];
let carsData = [];
let carsDisplayed = 0;
const carsPerPage = 12;

filterSectionOpen.addEventListener('click', () => {
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(filterContainer, 'block');
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR') location.reload();
    if (event.code === 'KeyF') {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(filterContainer, 'block');
    }
});

function createLinkElement(text, container, queryParam) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        carFilterForm.reset();
        loadCars({ [queryParam]: text });
    });
    container.appendChild(link);
}

function placeCatalogTypes(catalogTypes) {
    brandList.innerHTML = '';
    countryList.innerHTML = '';
    bodyTypeList.innerHTML = '';
    transmissionList.innerHTML = '';

    const sortedBrands = [...catalogTypes.brands].sort();
    const sortedCountries = [...catalogTypes.countries].sort();
    const sortedBodyTypes = [...catalogTypes.bodyTypes].sort();
    const sortedTransmissions = [...catalogTypes.transmissions].sort();

    sortedBrands.forEach(brand => createLinkElement(brand, brandList, 'brand'));
    sortedCountries.forEach(country => createLinkElement(country, countryList, 'country'));
    sortedBodyTypes.forEach(bodyType => createLinkElement(bodyType, bodyTypeList, 'features.body_type'));
    sortedTransmissions.forEach(transmission => createLinkElement(transmission, transmissionList, 'features.transmission'));

    const bodyTypeOptions = document.getElementById('body-type-options');
    bodyTypeOptions.innerHTML = '';
    sortedBodyTypes.forEach(bodyType => {
        const option = document.createElement('option');
        option.value = bodyType;
        bodyTypeOptions.appendChild(option);
    });
}

if (isAuthTokenExpired()) {
    toggleElementVisibility(catalogGrid, 'none');
    toggleElementVisibility(filterSectionOpen, 'none');
    toggleElementVisibility(goToHomePage, 'inline');
    showMessage('Для отримання доступу до катологу, необхідно увійти до облікового запису!', false);
}
else {
    document.addEventListener("DOMContentLoaded", async () => {
        showMessage('Завантаження...', true);

        try {
            const result = await fetchWithRetry('/api/get-catalog-types', retriesLimit);
            if (result) {
                catalogTypes = result;
                placeCatalogTypes(catalogTypes);
                showMessage('Дані успішно завантажені!', true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage('Помилка сервера, будь ласка, перезавантажте сторінку!', false);
        }
    });

    loadMoreCarsButton.addEventListener('click', loadMoreCars);
}

function loadMoreCars() {
    const nextCars = carsData.slice(carsDisplayed, carsDisplayed + carsPerPage);

    nextCars.forEach(car => carsContainer.appendChild(createCarCard(car)));
    carsDisplayed += nextCars.length;
    toggleElementVisibility(loadMoreCarsButton, carsDisplayed >= carsData.length ? 'none' : 'inline');
}

carFilterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    loadCars(Object.fromEntries(formData.entries()));
    hideAllElementsInModalWindow(modalWindow);
});

async function loadCars(filter) {
    showMessage('Завантаження...', true);

    try {
        const queryParams = new URLSearchParams(filter).toString();
        const result = await fetchWithRetry(`/api/get-cars-filter?${queryParams}`, retriesLimit);

        if (result && result.length > 0) {
            carsData = result;
            carsDisplayed = 0;
            carsContainer.innerHTML = '';
            loadMoreCars();
            toggleElementVisibility(catalogGrid, 'none');
            showMessage('Дані успішно завантажені!', true);
        } else {
            carsContainer.innerHTML = '';
            showMessage('Авто за обраними фільтрами не знайдено.', false);
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
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
                <a href="/pages/product-info.html?id=${car._id}" target="_blank">Детальніше <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
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
        if (validImages.length > 1) {
            imageInterval = setInterval(changeImage, 1500);
        }
    });

    carCard.addEventListener('mouseleave', () => {
        clearInterval(imageInterval);
        if (validImages.length > 0) {
            carImageElement.src = validImages[0];
        }
    });

    return carCard;
};