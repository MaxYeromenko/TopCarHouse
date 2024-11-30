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

const contentToSlide = document.getElementById('content-to-slide');
const content = contentToSlide.querySelectorAll('.content');
const contentLinks = contentToSlide.querySelectorAll('a');

function setLinks() {
    contentLinks[0]?.setAttribute('href', '/pages/pre-order.html');
    contentLinks[0]?.setAttribute('target', '_blank');
    contentLinks[1]?.setAttribute('href', '/pages/test-drive.html');
    contentLinks[1]?.setAttribute('target', '_blank');
}

if (isAuthTokenExpired()) {
    contentLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            showMessage('Для отримання доступу до функції, необхідно увійти до облікового запису!', false);
        });
    });
} else {
    setLinks();
}

let currentIndex = 0;

function updateSlider() {
    content.forEach((element) => element.classList.remove('top-slider-position'));

    content[currentIndex].classList.add('top-slider-position');

    currentIndex = (currentIndex + 1) % content.length;
}

setInterval(updateSlider, 5000);

const logButtons = document.querySelectorAll('.log-button');
const logOutButtons = document.querySelectorAll('.log-out-button');
const registerBox = document.getElementById('register-box');
const loginBox = document.getElementById('login-box');
const authContainer = document.getElementById('auth-container');
const requestResetBox = document.getElementById('request-reset-box');

const toggleButtonsVisibility = (showLogin) => {
    toggleElementsVisibility(logButtons, showLogin ? 'inline' : 'none');
    toggleElementsVisibility(logOutButtons, showLogin ? 'none' : 'inline');
    hideAllElementsInModalWindow(modalWindow);
};

if (isAuthTokenExpired()) {
    removeTokens([authTokenName]);
    showMessage('Приєднуйтесь до нашої спільноти, увійшовши до облікового запису або зареєструвавшись на головній сторінці.', true);
    toggleButtonsVisibility(true);
    removeAllTokens();
} else {
    toggleButtonsVisibility(false);
}

logButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(authContainer, 'block');
    });
});

const confirmationContainer = modalWindow.querySelector('#confirmation-container');
const confirmationForm = confirmationContainer.querySelector('form');
const yesButton = confirmationContainer.querySelector('button[name="yes"]');
const noButton = confirmationContainer.querySelector('button[name="no"]');

logOutButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(confirmationContainer, 'block');
    })
});

confirmationForm.addEventListener('submit', event => {
    event.preventDefault()
});

yesButton.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
    removeAllTokens();
    toggleButtonsVisibility(true);
    showMessage('Ви вийшли з облікового запису.', true);
});

noButton.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
});

document.getElementById('toggle-register').addEventListener('click', () => {
    toggleElementVisibility(loginBox, 'none');
    toggleElementVisibility(registerBox, 'block');
});

document.querySelectorAll('.toggle-login').forEach(element => {
    element.addEventListener('click', () => {
        toggleElementVisibility(registerBox, 'none');
        toggleElementVisibility(requestResetBox, 'none');
        toggleElementVisibility(loginBox, 'block');
    });
});

document.getElementById('toggle-reset-password').addEventListener('click', () => {
    toggleElementVisibility(loginBox, 'none');
    toggleElementVisibility(requestResetBox, 'block');
});

const loginRegex = /^[a-zA-Z0-9]{5,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

registerBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = String(event.target.querySelector('input[type="text"]').value).trim();
    const email = String(event.target.querySelector('input[type="email"]').value).trim().toLowerCase();
    const password = String(event.target.querySelector('input[type="password"]').value).trim();

    if (!loginRegex.test(name)) {
        showMessage('Логін має складатися з 5 цифр або літер!', false);
        return;
    }

    if (!emailRegex.test(email)) {
        showMessage('Неправильний формат електронної пошти!', false);
        return;
    }

    if (!passwordRegex.test(password)) {
        showMessage('Пароль має містити 8 символів, щонайменше 1 велику та маленьку літери та 1 цифру!', false);
        return;
    }

    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost(`/api/api-user-authorization`,
            { name, email, password }, retriesLimit);

        if (result.success) {
            event.target.reset();
            showMessage(result.message, result.success);
            toggleElementVisibility(registerBox, 'none');
            toggleElementVisibility(loginBox, 'block');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

loginBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = String(event.target.querySelector('input[type="email"]').value).trim();
    const password = String(event.target.querySelector('input[type="password"]').value).trim();
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost('/api/api-user-authorization',
            { email, password }, retriesLimit);

        if (result.success) {
            event.target.reset();
            localStorage.setItem(authTokenName, result.token);
            toggleButtonsVisibility(false);
            showMessage(result.message, true);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

requestResetBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = String(event.target.querySelector('input[type="email"]').value).trim().toLowerCase();

    if (!emailRegex.test(email)) {
        showMessage('Неправильний формат електронної пошти!', false);
        return;
    }

    showMessage('Надсилаємо листа з інструкціями...', true);

    try {
        const result = await fetchWithRetryPost('/api/request-password-reset', { email }, retriesLimit);

        if (result.success) {
            showMessage('Лист надіслано! Перевірте електронну пошту.', true);
            event.target.reset();
        } else {
            showMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

