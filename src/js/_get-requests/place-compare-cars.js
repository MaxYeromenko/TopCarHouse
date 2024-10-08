const compareSectionOpen = document.getElementById('compare-section-open');
const compareContainer = document.getElementById('compare-container');

compareSectionOpen.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(compareContainer, 'grid');
    updateCarsToCompare(compareContainer);
});

let isLoading = false;

async function updateCarsToCompare(compareContainer) {
    if (isLoading) return;
    isLoading = true;

    compareContainer.innerHTML = '';
    const carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];

    if (carsToCompare.length > 0) {
        showMessage('Завантаження...', true);

        const validCars = [];

        for (const carId of carsToCompare) {
            try {
                const result = await fetchWithRetry(`/api/get-cars-filter?id=${carId}`, retriesLimit);

                if (result) {
                    const carCard = createCompareCarCard(result[0]);
                    compareContainer.appendChild(carCard);
                    validCars.push(carId);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
            }
        }

        if (validCars.length !== carsToCompare.length) {
            localStorage.setItem('carsToCompare', JSON.stringify(validCars));
        }

        showMessage('Дані успішно завантажені!', true);
    } else {
        const nothingToCompareMessage = document.createElement('span');
        nothingToCompareMessage.className = 'nothing-to-compare-message';
        nothingToCompareMessage.textContent = 'Відсутні авто для порівняння!';
        compareContainer.appendChild(nothingToCompareMessage);
    }
    isLoading = false;
}

function createCompareCarCard(car) {
    const carCardToCompare = document.createElement('div');
    carCardToCompare.classList.add('carToCompare');

    carCardToCompare.innerHTML = `
    <div class="compare-item">
        <button><i class="fa-solid fa-trash-can"></i></button>
        <h2 id="compare-product-title">${car.brand} ${car.model}</h2>
        <div class="compare-product-info">
            <div>Рік: <span>${car.year}</span></div>
            <div>Потужність: <span>${car.features.horsepower} к.с.</span></div>
            <div>Ціна: <span>$${car.price}</span></div>
            <div>Колір: <span>${car.color}</span></div>
            <div>Країна: <span>${car.country}</span></div>
            <div>Коробка передач: <span>${car.features.transmission}</span></div>
            <div>Двигун: <span>${car.features.engine} л</span></div>
            <div>Споживання палива: <span>${car.features.fuel_consumption} л / 100 км</span></div>
            <div>Тип палива: <span>${car.features.fuel_type}</span></div>
            <div>Тип кузова: <span>${car.features.body_type}</span></div>
        </div>
    </div>`;

    carCardToCompare.querySelector('button').addEventListener('click', () => {
        removeCarFromCompare(car._id);
    });

    return carCardToCompare;
}

function removeCarFromCompare(carId) {
    const carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];
    const updatedCarsToCompare = carsToCompare.filter(id => id !== carId);

    localStorage.setItem('carsToCompare', JSON.stringify(updatedCarsToCompare));
    updateCarsToCompare(compareContainer);
}
