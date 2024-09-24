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

const retriesLimit = 3;

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

async function fetchWithRetryPost(url, data, retries) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'HTTP error!');
            }

            return responseData;
        } catch (error) {
            console.error(`Попытка ${i + 1} из ${retries}: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
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
