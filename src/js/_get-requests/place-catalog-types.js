const catalogSection = document.querySelector('.catalog');
const countryList = catalogSection.querySelector('#country-list');
const brandList = catalogSection.querySelector('#brand-list');
const bodyTypeList = catalogSection.querySelector('#body-type-list');
const transmissionList = catalogSection.querySelector('#transmission-list');
let catalogTypes = [];

const cardsSection = document.querySelector('.cards-section');
const carsContainer = document.createElement('div');
carsContainer.className = 'cars-container';
cardsSection.appendChild(carsContainer);
const cardsSectionButtons = document.createElement('div');
cardsSectionButtons.className = 'cards-section-buttons';
cardsSection.appendChild(cardsSectionButtons);
const goToHomePage = document.createElement('a');
goToHomePage.href = '/';
goToHomePage.textContent = 'На головну';
cardsSectionButtons.appendChild(goToHomePage);

if (isAuthTokenExpired()) {
    toggleElementVisibility(catalogSection, 'none');
    toggleElementVisibility(goToHomePage, 'inline');
    showMessage('Для отримання доступу до катологу, необхідно увійти до облікового запису!', false);
}
else
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

function placeCatalogTypes(catalogTypes) {
    brandList.innerHTML = '';
    countryList.innerHTML = '';
    bodyTypeList.innerHTML = '';
    transmissionList.innerHTML = '';

    for (const brand of catalogTypes.brands.sort()) {
        const brandLink = document.createElement('a');
        brandLink.href = '#';
        brandLink.textContent = brand;
        brandLink.addEventListener('click', (e) => {
            e.preventDefault()
            loadCars({ brand });
        });
        brandList.appendChild(brandLink);
    }

    for (const country of catalogTypes.countries.sort()) {
        countryList.innerHTML += `<a href="/cars?country=${encodeURIComponent(country)}">${country}</a>`;
    }

    for (const bodyType of catalogTypes.bodyTypes.sort()) {
        bodyTypeList.innerHTML += `<a href="/cars?bodyType=${encodeURIComponent(bodyType)}">${bodyType}</a>`;
    }

    for (const transmission of catalogTypes.transmissions.sort()) {
        transmissionList.innerHTML += `<a href="/cars?transmission=${encodeURIComponent(transmission)}">${transmission}</a>`;
    }
}

async function loadCars(filter) {
    try {
        const queryParams = new URLSearchParams(filter).toString();
        const result = await fetchWithRetry(`/api/get-cars-by-type?${queryParams}`, retriesLimit);

        displayCars(result);
    } catch (error) {
        console.error('Error fetching cars:', error);
    }
}

function displayCars(cars) {
    carsContainer.innerHTML = '';

    cars.forEach((car) => {
        const carElement = document.createElement('div');
        carElement.classList.add('car-card');
        carElement.innerHTML = `
            <h3>${car.brand} ${car.model}</h3>
            <p>Year: ${car.year}</p>
            <p>Price: ${car.price}</p>
            <img src="${car.images[0] || '/default-car-image.jpg'}" alt="${car.model}">
        `;
        carsContainer.appendChild(carElement);
    });
}