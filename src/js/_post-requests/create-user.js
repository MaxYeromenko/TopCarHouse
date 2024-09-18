const loginRegex = /^[a-zA-Z0-9]{5,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const form = document.getElementById('register-form');

form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
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

    message.classList.remove('invisible');

    let result = null;

    try {
        const response = await fetch('api/post-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        result = await response.json();

        if (response.ok && result.success) {
            showMessage(result.message, result.success);
            form.reset();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        } else {
            showMessage('Помилка: ' + result.message, false);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера! ' + result.message, result.success);
    }

    messageClose.onclick = () => {
        message.classList.add('invisible');
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    };
});

function showMessage(text, isSuccess) {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
    }
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }

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