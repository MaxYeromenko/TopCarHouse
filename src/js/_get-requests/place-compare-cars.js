const compareSectionOpen = document.getElementById('compare-section-open');
const compareSection = document.getElementById('compare-section');
const compareCloseButton = document.getElementById('compare-close-button');

compareSectionOpen.addEventListener('click', () => {
    compareSection.style.visibility = 'visible';
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

let carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];

document.addEventListener("DOMContentLoaded", async () => {
    const carsContainer = document.getElementById('compare-container');

    if (carsToCompare.length > 0) {
        showMessage('Завантаження...', true);

        carsContainer.innerHTML = '';

        for (const carId of carsToCompare) {
            let result = null;
            try {
                result = await fetchWithRetry(`/api/get-one-car?id=${carId}`, 3);

                if (result) {
                    const carCard = createCarCard(result);
                    carsContainer.appendChild(carCard);
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
        carsContainer.appendChild(nothingToCompareMessage);
    }
});

function showMessage(text, isSuccess) {
    if (hideTimeout) clearTimeout(hideTimeout);
    if (resetTimeout) clearTimeout(resetTimeout);

    const message = document.querySelector('.info-message');
    const messageText = document.querySelector('.info-message .message-text');

    messageText.textContent = text;
    message.classList.toggle('success-message', isSuccess);
    message.classList.toggle('error-message', !isSuccess);

    message.classList.remove('invisible');

    hideTimeout = setTimeout(() => {
        message.classList.add('invisible');
    }, 3000);

    resetTimeout = setTimeout(() => {
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    }, 4000);
}

function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.classList.add('car');

    carCard.innerHTML = `
    <div class="compare-item">
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

    return carCard;
}

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
            showMessage('Помилка сервера, зачекайте будь ласка, повторна спроба...', false);
            console.error(`Попытка ${i + 1} из ${retries}: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
