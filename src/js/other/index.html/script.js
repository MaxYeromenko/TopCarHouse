import {
    createConsultationRequest,
    themeApplication,
    showServicesModalWindow,
    calculatorIntegration,
    compareCarsIntegration
} from '../_general-functions-module/script.js';

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
    removeToken('jwtToken');
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
        removeToken('jwtToken');
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