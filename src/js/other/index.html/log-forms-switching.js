const logButtons = document.querySelectorAll('.log-button');
const toggleRegister = document.getElementById('toggle-register');
const toggleLogin = document.getElementById('toggle-login');
const registerBox = document.getElementById('register-box');
const loginBox = document.querySelector('.auth-box');
const closeButton = document.getElementById('close-button');
const authContainer = document.getElementById('auth-container');

if (isAuthTokenExpired()) {
    localStorage.removeItem('jwtToken');
    if (currentPage !== '/index.html') {
        window.location.href = '/index.html';
        showMessage('Приєднуйтесь до нашої спільноти, увійшовши до облікового запису або зареєструвавшись на головній сторінці.', true);
    }

    // if (window.location.pathname !== '/index.html') {
    //     window.location.href = '/index.html';
    // }

    // authContainer.style.visibility = 'visible';
    // registerBox.classList.add('hidden');
    // loginBox.classList.remove('hidden');

    logButtons.forEach(button => {
        button.classList.remove('hidden');
    });
} else {
    logButtons.forEach(button => {
        button.classList.add('hidden');
    });
}

logButtons.forEach(button => {
    button.addEventListener('click', () => {
        authContainer.style.visibility = 'visible';
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