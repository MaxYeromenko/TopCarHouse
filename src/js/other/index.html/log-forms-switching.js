const logButtons = document.querySelectorAll('.log-button');
const toggleRegister = document.getElementById('toggle-register');
const toggleLogin = document.getElementById('toggle-login');
const registerBox = document.getElementById('register-box');
const loginBox = document.querySelector('.auth-box');
const closeButton = document.getElementById('close-button');
const authContainer = document.getElementById('auth-container');

checkAuth();

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