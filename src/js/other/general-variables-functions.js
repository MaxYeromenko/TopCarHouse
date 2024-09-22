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

function checkAuth() {
    const token = localStorage.getItem('jwtToken');

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/index.html';
        authContainer.style.visibility = 'visible';
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
        showMessage('Будь ласка, увійдіть до облікового запису.', false);

        loginButtons.forEach(button => {
            button.classList.remove('hidden');
        });
    } else {
        logButtons.forEach(button => {
            button.classList.add('hidden');
        });
    }
}