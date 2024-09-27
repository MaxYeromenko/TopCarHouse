const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';
const default_car_URL = 'https://res.cloudinary.com/dukwtlvte/image/upload/v1725616540/default_car.jpg';

const modalWindow = document.getElementById('modal-window');

modalWindow.querySelector('.fa-xmark').addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideAllElementsInModalWindow(modalWindow);
    }
});

function toggleElementVisibility(element, displayType) {
    element.style.display = displayType;
};

function toggleElementsVisibility(elements, displayType) {
    elements.forEach(element => {
        element.style.display = displayType;
    });
};

function hideAllElementsInModalWindow(modalWindow) {
    const modalWindowChildren = modalWindow.querySelectorAll('.modal-window-element');

    toggleElementsVisibility(modalWindowChildren, 'none');

    toggleElementVisibility(modalWindow, 'none');
}

function checkImageValidity(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => resolve(imageUrl);
        img.onerror = () => reject(imageUrl);
    });
}

let hideTimeout = null;
let resetTimeout = null;

function showMessage(text, isSuccess) {
    const message = document.querySelector('.info-message');
    const messageText = document.querySelector('.info-message .message-text');
    const messageCloseButton = document.querySelector('.info-message .fa-xmark');

    if (hideTimeout) clearTimeout(hideTimeout);
    if (resetTimeout) clearTimeout(resetTimeout);

    messageCloseButton.addEventListener('click', () => {
        message.classList.add('invisible');
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    });

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

const retriesLimit = 3;
async function handleRequest(url, options = {}, retries) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const responseData = await response.json();

            if (!response.ok) {
                showMessage(`Помилка: ${responseData.message}`, false);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (responseData.message == '') {
                showMessage(responseData.message, true);
            }

            return responseData;
        } catch (error) {
            console.error(`Спроба ${i + 1} з ${retries}: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function fetchWithRetry(url, retries) {
    return handleRequest(url, {}, retries);
}

async function fetchWithRetryPost(url, data, retries) {
    return handleRequest(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, retries);
}

function isAuthTokenExpired() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return true;

    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    const currentTime = Date.now() / 1000;
    return decodedPayload.exp < currentTime;
}

function removeToken(name) {
    localStorage.removeItem(name);
}

function addToCarToLocalStorage(carId) {
    const maxCarsToCompare = isAuthTokenExpired() ? 2 : 8;
    let carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];

    if (carsToCompare.length >= maxCarsToCompare) {
        const message = maxCarsToCompare === 2
            ? 'Одночасно можна порівнювати лише 2 машини. Увійдіть в обліковий запис щоб порівняти до 8!'
            : 'Одночасно можна порівнювати 8 машини.';
        showMessage(message, false);
        return;
    }

    if (carsToCompare.includes(carId)) {
        showMessage('Це авто вже додано до порівняння.', false);
    } else {
        carsToCompare.push(carId);
        localStorage.setItem('carsToCompare', JSON.stringify(carsToCompare));
        showMessage('Авто додано до порівняння.', true);
    }
}
