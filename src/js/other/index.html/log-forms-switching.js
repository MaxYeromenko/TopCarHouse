const logButtons = document.querySelectorAll('.log-button');
const logOutButtons = document.querySelectorAll('.log-out-button');
const toggleRegister = document.getElementById('toggle-register');
const toggleLogin = document.getElementById('toggle-login');
const registerBox = document.getElementById('register-box');
const loginBox = document.querySelector('.auth-box');
const closeButton = document.getElementById('close-button');
const authContainer = document.getElementById('auth-container');

if (isAuthTokenExpired()) {
    removeToken('jwtToken');
    showMessage('Приєднуйтесь до нашої спільноти, увійшовши до облікового запису або зареєструвавшись на головній сторінці.', true);

    // if (window.location.pathname !== '/') {
    //     window.location.href = '/';
    // }

    // authContainer.style.visibility = 'visible';
    // registerBox.classList.add('hidden');
    // loginBox.classList.remove('hidden');

    logButtons.forEach(button => {
        button.classList.remove('hidden');
    });

    logOutButtons.forEach(button => {
        button.classList.add('hidden');
    });
} else {
    logOutButtons.forEach(button => {
        button.classList.remove('hidden');
    });

    logButtons.forEach(button => {
        button.classList.add('hidden');
    });
}

logButtons.forEach(button => {
    button.addEventListener('click', () => {
        authContainer.style.visibility = 'visible';
    });
});

logOutButtons.forEach(button => {
    button.addEventListener('click', () => {
        removeToken('jwtToken');
        location.reload();
        showMessage('Ви вийшли з облікового запису.', true);
    });
});

closeButton.addEventListener('click', () => {
    authContainer.style.visibility = 'hidden';
});

toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        authContainer.style.visibility = 'hidden';
    }
});