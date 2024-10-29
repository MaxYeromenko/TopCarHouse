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

const logButtons = document.querySelectorAll('.log-button');
const logOutButtons = document.querySelectorAll('.log-out-button');
const registerBox = document.getElementById('register-box');
const loginBox = document.getElementById('login-box');
const authContainer = document.getElementById('auth-container');

const toggleButtonsVisibility = (showLogin) => {
    toggleElementsVisibility(logButtons, showLogin ? 'inline' : 'none');
    toggleElementsVisibility(logOutButtons, showLogin ? 'none' : 'inline');
    hideAllElementsInModalWindow(modalWindow);
};

if (isAuthTokenExpired()) {
    removeToken(authTokenName);
    showMessage('Приєднуйтесь до нашої спільноти, увійшовши до облікового запису або зареєструвавшись на головній сторінці.', true);
    toggleButtonsVisibility(true);
} else {
    toggleButtonsVisibility(false);
}

logButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(authContainer, 'block');
    });
});

logOutButtons.forEach(button => {
    button.addEventListener('click', () => {
        removeToken(authTokenName);
        localStorage.removeItem('carsToCompare');
        toggleButtonsVisibility(true);
        showMessage('Ви вийшли з облікового запису.', true);
    });
});

document.getElementById('toggle-register').addEventListener('click', () => {
    toggleElementVisibility(loginBox, 'none');
    toggleElementVisibility(registerBox, 'block');
});

document.getElementById('toggle-login').addEventListener('click', () => {
    toggleElementVisibility(registerBox, 'none');
    toggleElementVisibility(loginBox, 'block');
});

const loginRegex = /^[a-zA-Z0-9]{5,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const form = document.querySelector('#register-box form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = String(document.getElementById('register-email').value).toLowerCase();
    const password = document.getElementById('register-password').value;

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
        const result = await fetchWithRetryPost(`/api/post-user`,
            { name, email, password }, retriesLimit);

        if (result.success) {
            showMessage(result.message, result.success);
            form.reset();
            toggleElementVisibility(registerBox, 'none');
            toggleElementVisibility(loginBox, 'block');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});


document.querySelector('#login-box form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (result.success) {
            localStorage.setItem(authTokenName, result.token);
            toggleButtonsVisibility(false);
            showMessage(result.message, true);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});