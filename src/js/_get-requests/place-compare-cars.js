const compareSectionOpen = document.getElementById('compare-section-open');
const compareSection = document.getElementById('compare-section');
const compareCloseButton = document.getElementById('compare-close-button');
const compareContainer = document.getElementById('compare-container');

compareSectionOpen.addEventListener('click', () => {
    compareSection.style.visibility = 'visible';
    updateCarsToCompare(compareContainer);
});

compareCloseButton.addEventListener('click', () => {
    compareSection.style.visibility = 'hidden';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        compareSection.style.visibility = 'hidden';
    }

    if (event.code === 'KeyC') {
        compareSection.style.visibility = 'visible';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    updateCarsToCompare(compareContainer);
});

async function updateCarsToCompare(compareContainer) {
    compareContainer.innerHTML = '';
    const carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];

    if (carsToCompare.length > 0) {
        showMessage('Завантаження...', true);

        for (const carId of carsToCompare) {
            try {
                const result = await fetchWithRetry(`/api/get-one-car?id=${carId}`, retriesLimit);

                if (result) {
                    const carCard = createCompareCarCard(result);
                    compareContainer.appendChild(carCard);
                } else {
                    showMessage('Помилка: Невідома помилка під час завантаження даних', false);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
            }
        }

        showMessage('Дані успішно завантажені!', true);
    } else {
        const nothingToCompareMessage = document.createElement('span');
        nothingToCompareMessage.className = 'nothing-to-compare-message';
        nothingToCompareMessage.textContent = 'Відсутні авто для порівняння!';
        compareContainer.appendChild(nothingToCompareMessage);
    }
}

function createCompareCarCard(car) {
    const carCardToCompare = document.createElement('div');
    carCardToCompare.classList.add('carToCompare');

    carCardToCompare.innerHTML = `
    <div class="compare-item">
        <button class="remove-car-button"><i class="fa-solid fa-trash-can"></i></button>
        <h2 id="compare-product-title">${car.brand} ${car.model}</h2>
        <div class="compare-product-info">
            <div>Рік: <span>${car.year}</span></div>
            <div>Потужність: <span>${car.features.horsepower} к.с.</span></div>
            <div>Ціна: $<span>${car.price}</span></div>
            <div>Колір: <span>${car.color}</span></div>
            <div>Коробка передач: <span>${car.features.transmission}</span></div>
            <div>Двигун: <span>${car.features.engine}</span></div>
            <div>Споживання палива: <span>${car.features.fuel_consumption} л / 100 км</span></div>
            <div>Тип палива: <span>${car.features.fuel_type}</span></div>
        </div>
    </div>`;

    const removeButton = carCardToCompare.querySelector('.remove-car-button');
    removeButton.addEventListener('click', () => {
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
