import {
    createConsultationRequest,
    themeApplication,
    showServicesModalWindow,
    calculatorIntegration,
    compareCarsIntegration
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();
calculatorIntegration();
compareCarsIntegration();

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

let carIdToEdit = null;
let carIdToDelete = null;

let catalogTypes = [];
let carsData = [];
let carsDisplayed = 0;
const carsPerPage = 12;

filterSectionOpen.addEventListener('click', () => {
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(filterContainer, 'block');
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
    const sortedModels = [...catalogTypes.models].sort();
    const sortedColors = [...catalogTypes.colors].sort();
    const sortedCountries = [...catalogTypes.countries].sort();
    const sortedTransmissions = [...catalogTypes.transmissions].sort();
    const sortedFuelTypes = [...catalogTypes.fuelTypes].sort();
    const sortedBodyTypes = [...catalogTypes.bodyTypes].sort();

    sortedBrands.forEach(brand => createLinkElement(brand, brandList, 'brand'));
    sortedCountries.forEach(country => createLinkElement(country, countryList, 'country'));
    sortedTransmissions.forEach(transmission => createLinkElement(transmission, transmissionList, 'features.transmission'));
    sortedBodyTypes.forEach(bodyType => createLinkElement(bodyType, bodyTypeList, 'features.body_type'));

    const brandOptions = document.getElementById('brand-options');
    brandOptions.innerHTML = '';
    sortedBrands.forEach(brandType => {
        const option = document.createElement('option');
        option.value = brandType;
        brandOptions.appendChild(option);
    });

    const modelOptions = document.getElementById('model-options');
    modelOptions.innerHTML = '';
    sortedModels.forEach(modelType => {
        const option = document.createElement('option');
        option.value = modelType;
        modelOptions.appendChild(option);
    });

    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    sortedColors.forEach(colorType => {
        const option = document.createElement('option');
        option.value = colorType;
        colorOptions.appendChild(option);
    });

    const countryOptions = document.getElementById('country-options');
    countryOptions.innerHTML = '';
    sortedCountries.forEach(countryType => {
        const option = document.createElement('option');
        option.value = countryType;
        countryOptions.appendChild(option);
    });

    const transmissionOptions = document.getElementById('transmission-options');
    transmissionOptions.innerHTML = '';
    sortedTransmissions.forEach(transmissionType => {
        const option = document.createElement('option');
        option.value = transmissionType;
        transmissionOptions.appendChild(option);
    });

    const fuelTypeOptions = document.getElementById('fuel-type-options');
    fuelTypeOptions.innerHTML = '';
    sortedFuelTypes.forEach(fuelType => {
        const option = document.createElement('option');
        option.value = fuelType;
        fuelTypeOptions.appendChild(option);
    });

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
    const { role } = getUserIdRoleFromToken();
    if (role === 'admin') {
        const adminButton = document.createElement('button');
        adminButton.addEventListener('click', () => { carIdToEdit = null })
        adminButton.id = 'admin-section-open';
        adminButton.title = 'Відкрити адмін панель';
        adminButton.innerHTML = '<i class="fa-solid fa-user-tie"></i>';

        adminButton.addEventListener('click', openAdminPanel);
        document.querySelector('.open-section-button-container').appendChild(adminButton);
    }

    document.addEventListener("DOMContentLoaded", async () => {
        showMessage('Завантаження...', true);

        const cacheKey = 'carsTypesCache';
        try {
            const result = await fetchWithCache('/api/get-car-types', cacheKey, cacheExpiration, retriesLimit);
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

let indexTypes = [];

async function openAdminPanel() {
    if (!document.getElementById('admin-container')) {
        const adminPanelContent = `
        <div id="admin-container" class="modal-window-element">
            <h2>Додавання автомобіля</h2>
            <form>
                <input type="text" id="brand" name="brand" placeholder="Бренд" title="Бренд" list="brand-options" required>
                    <datalist id="brand-options"></datalist>
                <input type="text" id="model" name="model" placeholder="Модель" title="Модель" list="model-options" required>
                    <datalist id="model-options"></datalist>
                <input type="number" id="year" name="year" min="1886" max="2024" placeholder="Рік випуску" title="Рік випуску" required>
                <input type="number" min="0" id="price" name="price" placeholder="Ціна (дол. США)" title="Ціна" step="0.1" required>
                <input type="text" id="color" name="color" placeholder="Колір" title="Колір" list="color-options" required>
                    <datalist id="color-options"></datalist>
                <textarea id="description" name="description" placeholder="Опис" title="Опис" required></textarea>
                <input type="text" id="country" name="country" placeholder="Країна-виробник" title="Країна-виробник" list="country-options" required>
                    <datalist id="country-options"></datalist>
                <textarea id="imageUrls" name="imageUrls" placeholder="Введіть URL-адреси зображень через кому" title="URL-адреси зображень"></textarea>
                <input type="file" id="images" name="images" accept="image/*" title="Завантажте до 5 зображень авто" multiple>
                <input type="text" id="transmission" name="transmission" placeholder="Коробка передач" title="Коробка передач" list="transmission-options" required>
                    <datalist id="transmission-options"></datalist>
                <input type="number" min="0" id="engine" name="engine" placeholder="Об'єм двигуна (л)" title="Об'єм двигуна" step="0.1" required>
                <input type="text" id="fuel_type" name="fuel_type" placeholder="Тип пального" title="Тип пального" list="fuel-type-options" required>
                    <datalist id="fuel-type-options"></datalist>
                <input type="number" min="0" id="horsepower" name="horsepower" placeholder="Потужність (к. с.)" title="Потужність" required>
                <input type="number" min="0" id="fuel_consumption" name="fuel_consumption" placeholder="Споживання пального (л/100км)" title="Споживання пального" step="0.1" required>
                <input type="text" id="body_type" name="body_type" placeholder="Тип кузова" title="Тип кузова" list="body-type-options" required>
                    <datalist id="body-type-options"></datalist>
                <button type="submit">Зберегти автомобіль</button>
            </form>
        </div>`;
        modalWindow.insertAdjacentHTML('beforeend', adminPanelContent);

        initializeFormSubmission();
    }

    const adminPanel = modalWindow.querySelector('#admin-container');
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(adminPanel, 'block');

    const cacheKey = 'carsTypesCache';
    try {
        const result = await fetchWithCache('/api/get-car-types', cacheKey, cacheExpiration, retriesLimit);
        if (result) {
            indexTypes = result;
            placeIndexTypes(indexTypes);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, перезавантажте сторінку!', false);
    }
};

function placeIndexTypes(indexTypes) {
    const sortedBrands = [...indexTypes.brands].sort();
    const sortedModels = [...indexTypes.models].sort();
    const sortedColors = [...indexTypes.colors].sort();
    const sortedCountries = [...indexTypes.countries].sort();
    const sortedTransmissions = [...indexTypes.transmissions].sort();
    const sortedFuelTypes = [...indexTypes.fuelTypes].sort();
    const sortedBodyTypes = [...indexTypes.bodyTypes].sort();

    const brandOptions = document.getElementById('brand-options');
    brandOptions.innerHTML = '';
    sortedBrands.forEach(brandType => {
        const option = document.createElement('option');
        option.value = brandType;
        brandOptions.appendChild(option);
    });

    const modelOptions = document.getElementById('model-options');
    modelOptions.innerHTML = '';
    sortedModels.forEach(modelType => {
        const option = document.createElement('option');
        option.value = modelType;
        modelOptions.appendChild(option);
    });

    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    sortedColors.forEach(colorType => {
        const option = document.createElement('option');
        option.value = colorType;
        colorOptions.appendChild(option);
    });

    const countryOptions = document.getElementById('country-options');
    countryOptions.innerHTML = '';
    sortedCountries.forEach(countryType => {
        const option = document.createElement('option');
        option.value = countryType;
        countryOptions.appendChild(option);
    });

    const transmissionOptions = document.getElementById('transmission-options');
    transmissionOptions.innerHTML = '';
    sortedTransmissions.forEach(transmissionType => {
        const option = document.createElement('option');
        option.value = transmissionType;
        transmissionOptions.appendChild(option);
    });

    const fuelTypeOptions = document.getElementById('fuel-type-options');
    fuelTypeOptions.innerHTML = '';
    sortedFuelTypes.forEach(fuelType => {
        const option = document.createElement('option');
        option.value = fuelType;
        fuelTypeOptions.appendChild(option);
    });

    const bodyTypeOptions = document.getElementById('body-type-options');
    bodyTypeOptions.innerHTML = '';
    sortedBodyTypes.forEach(bodyType => {
        const option = document.createElement('option');
        option.value = bodyType;
        bodyTypeOptions.appendChild(option);
    });
}

function initializeFormSubmission() {
    modalWindow.querySelector('#admin-container form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const fileImages = formData.getAll('images').filter(image => {
            return image.name && image.size > 0;
        });
        const urlImages = formData.get('imageUrls')
            .split(',')
            .map(url => url.trim())
            .filter(url => url);

        const imageUrls = [];

        if (fileImages.length + urlImages.length > 5) {
            showMessage('Можна завантажити не більше 5 зображень!', false);
            return;
        }

        for (const image of fileImages) {
            const formDataCloudinary = new FormData();
            formDataCloudinary.append('file', image);
            formDataCloudinary.append('upload_preset', 'ml_default');
            formDataCloudinary.append('folder', 'cars');

            try {
                const result = await handleRequest(`https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`, {
                    method: "POST",
                    body: formDataCloudinary
                }, retriesLimit);

                if (result.secure_url) {
                    imageUrls.push(result.secure_url);
                    showMessage(`Фото ${image.name} успішно відправлено!`, true);
                }
            }
            catch (error) {
                console.error(error);
                showMessage(`Фото ${image.name} не вдалося відправити!`, false);
            }
        };

        for (const url of urlImages) {
            if (/^https?:\/\/.+\.(avif|heif|heic|jpg|jpeg|jpe|jif|jfif|jfi|png|webp)$/i.test(url)) {
                imageUrls.push(url);
            } else {
                showMessage(`Фото з посиланням ${url} не вдалося відправити!`, false);
            }
        };

        const carData = {
            brand: formData.get('brand').trim(),
            model: formData.get('model').trim(),
            year: formData.get('year').trim(),
            price: Math.abs(formData.get('price').trim()),
            color: formData.get('color').trim(),
            description: formData.get('description').trim(),
            country: formData.get('country').trim(),
            images: imageUrls,
            features: {
                transmission: formData.get('transmission').trim(),
                engine: Math.abs(formData.get('engine').trim()),
                fuel_type: formData.get('fuel_type').trim(),
                horsepower: Math.abs(formData.get('horsepower').trim()),
                fuel_consumption: formData.get('fuel_consumption').trim(),
                body_type: formData.get('body_type').trim()
            }
        };

        if (carIdToEdit) {
            carData.id = carIdToEdit;
        }

        try {
            const result = await fetchWithRetryPost(`/api/api-cars-control`,
                carData, retriesLimit);

            if (result) {
                removeTokens(['carsTypesCache', 'bestCarDealsCache', `car${carIdToEdit}`]);
                carIdToEdit = null;
                showMessage('Авто успішно додано!', true);
                event.target.reset();
            }
        }
        catch (error) {
            console.log(error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
    });
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
        const queryParams = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filter)
                    .map(([key, value]) => [key, value.trim()])
            )).toString();

        const result = await fetchWithRetry(`/api/api-cars-control?${queryParams}`, retriesLimit);

        carsContainer.innerHTML = '';
        if (result && result.length > 0) {
            carsData = result;
            carsDisplayed = 0;
            loadMoreCars();
            toggleElementVisibility(catalogGrid, 'none');
            showMessage('Дані успішно завантажені!', true);
        } else {
            showMessage('Авто за обраними фільтрами не знайдено.', false);
            toggleElementVisibility(loadMoreCarsButton, 'none');
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
}

const confirmationContainer = modalWindow.querySelector('#confirmation-container');
const confirmationForm = confirmationContainer.querySelector('form');
const yesButton = confirmationContainer.querySelector('button[name="yes"]');
const noButton = confirmationContainer.querySelector('button[name="no"]');

confirmationForm.addEventListener('submit', event => {
    event.preventDefault()
});

yesButton.addEventListener('click', async () => {
    showMessage('Видалення...', true);
    try {
        const result = await fetchWithRetryDelete(`/api/api-cars-control?id=${carIdToDelete}`, retriesLimit);

        if (result) {
            removeTokens(['carsTypesCache', 'bestCarDealsCache', `car${carIdToDelete}`]);
            carIdToDelete = null;
            showMessage('Авто успішно видалено!', true);
        }
    }
    catch (error) {
        console.log(error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

noButton.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
});

function createCarCard(car) {
    const carCard = document.createElement('div');

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

    const { role } = getUserIdRoleFromToken();

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
                ${role === 'admin' ? `<button class="edit-car-info" data-id="${car._id}">Відредагувати</button>` : ''}
                ${carIdToEdit !== null && role === 'admin' ? `<button class="delet-car" data-id="${car._id}">Видалити</button>` : ''}
            </div>
        </div>`;

    if (role === 'admin') {
        carCard.querySelector('.edit-car-info').addEventListener('click', (event) => {
            carIdToEdit = event.target.dataset.id;
            editCarInfo();
        });

        carCard.querySelector('.delet-car').addEventListener('click', (event) => {
            carIdToDelete = event.target.dataset.id;
        });

        async function editCarInfo() {
            try {
                const cacheKey = `car${car._id}`;
                const result = await fetchWithCache(`/api/api-cars-control?id=${car._id}`, cacheKey, cacheExpiration, retriesLimit);

                if (result && result.length > 0) {
                    const carObject = result[0];
                    openAdminPanel();

                    const editCarForm = document.querySelector('#admin-container form');

                    editCarForm.querySelector('#brand').value = carObject.brand || '';
                    editCarForm.querySelector('#model').value = carObject.model || '';
                    editCarForm.querySelector('#year').value = carObject.year || '';
                    editCarForm.querySelector('#price').value = carObject.price || '';
                    editCarForm.querySelector('#color').value = carObject.color || '';
                    editCarForm.querySelector('#description').value = carObject.description || '';
                    editCarForm.querySelector('#country').value = carObject.country || '';
                    editCarForm.querySelector('#imageUrls').value = carObject.images.join(', ') || '';
                    editCarForm.querySelector('#transmission').value = carObject.features.transmission || '';
                    editCarForm.querySelector('#engine').value = carObject.features.engine || '';
                    editCarForm.querySelector('#fuel_type').value = carObject.features.fuel_type || '';
                    editCarForm.querySelector('#horsepower').value = carObject.features.horsepower || '';
                    editCarForm.querySelector('#fuel_consumption').value = carObject.features.fuel_consumption || '';
                    editCarForm.querySelector('#body_type').value = carObject.features.body_type || '';

                    showMessage('Дані успішно завантажені!', true);
                } else {
                    showMessage('Авто не знайдено.', false);
                    toggleElementVisibility(loadMoreCarsButton, 'none');
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
                showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
            }
        };
    };

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