const catalogSection = document.querySelector('.catalog');
const countryList = catalogSection.querySelector('#country-list');
const brandList = catalogSection.querySelector('#brand-list');
const bodyTypeList = catalogSection.querySelector('#body-type-list');
const transmissionList = catalogSection.querySelector('#transmission-list');
let catalogTypes = [];

const cardsSection = document.querySelector('.cards-section');
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
            console.error('Error fetching cars data:', error);
            showMessage('Помилка сервера, будь ласка, перезавантажте сторінку!', false);
        }
    });

function placeCatalogTypes(catalogTypes) {
    for (const brand of catalogTypes.brands) {
        brandList.innerHTML = `<span>${brand}</span>`;
    }
    for (const country of catalogTypes.countries) {
        countryList.innerHTML = `<span>${country}</span>`;
    }
    for (const bodyType of catalogTypes.bodyTypes) {
        bodyTypeList.innerHTML = `<span>${bodyType}</span>`;
    }
    for (const transmission of catalogTypes.transmissions) {
        transmissionList.innerHTML = `<span>${transmission}</span>`;
    }
}