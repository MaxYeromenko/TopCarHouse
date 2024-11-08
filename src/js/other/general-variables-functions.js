const cloudinaryURL = 'https://res.cloudinary.com/dukwtlvte/image/upload/';
const cloudinaryName = 'dukwtlvte';
const default_car_URL = 'https://res.cloudinary.com/dukwtlvte/image/upload/v1725616540/default_car.jpg';

function applySavedTheme() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('selected-theme') || 'default-theme');
}

const modalWindow = document.getElementById('modal-window');

modalWindow.querySelector('.fa-xmark').addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
})

document.addEventListener('DOMContentLoaded', () => hideAllElementsInModalWindow(modalWindow));

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
        img.alt = "Валідне зображення";
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
const cacheExpiration = 600000;

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

async function fetchWithCache(url, cacheKey, cacheExpiration, retries) {
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    const isCacheValid = cachedData && (Date.now() - cachedData.timestamp < cacheExpiration);

    if (isCacheValid) {
        return cachedData.data;
    }

    try {
        const result = await fetchWithRetry(url, retries);
        if (result) {
            localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
            return result;
        }
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw new Error('Помилка сервера, будь ласка, перезавантажте сторінку!');
    }
}

const authTokenName = 'jwtToken';

function isAuthTokenExpired() {
    const token = localStorage.getItem(authTokenName);
    if (!token) return true;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const currentTime = Date.now() / 1000;
        return decodedPayload.exp < currentTime;
    } catch (error) {
        return true;
    }
}

function getUserIdRoleFromToken() {
    const token = localStorage.getItem(authTokenName);
    if (token) {
        try {
            const { id, role } = JSON.parse(atob(token.split('.')[1]));
            return { id, role };
        } catch (error) {
            console.error('Помилка під час декодування токену:', error);
            showMessage('Помилка, перезайдіть до облікового запису!', false);
            return null;
        }
    }
    return null;
}

/**
 * Removes a list of tokens from localStorage.
 * @param {string[]} tokens - An array of token keys to remove from localStorage.
 * @throws Will throw an error if the argument is not an array.
 */
function removeTokens(tokens) {
    if (!Array.isArray(tokens)) {
        throw new Error(`An array was expected, but received ${typeof tokens}.`);
    }

    for (const token of tokens) {
        localStorage.removeItem(token);
    }
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
