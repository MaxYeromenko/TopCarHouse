const consultationButton = document.querySelector('.consultation-button');
const consultationContainer = document.getElementById('consultation-container');
const consCloseButton = document.getElementById('close-button-second');

consultationButton.addEventListener('click', () => {
    consultationContainer.style.visibility = 'visible';
});

consCloseButton.addEventListener('click', () => {
    consultationContainer.style.visibility = 'hidden';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        consultationContainer.style.visibility = 'hidden';
    }
});

const consultationForm = document.getElementById('consultation-form');
const nameRegex = /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ]{3,}$/;
const phoneRegex = /^\+380\d{9}$/;

consultationForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('consultation-name').value;
    const phone = document.getElementById('consultation-phone').value;
    const dateInput = document.getElementById('consultation-date').value;
    const timeInput = document.getElementById('consultation-time').value;
    const selectedDateTime = new Date(`${dateInput}T${timeInput}`);
    const currentDateTime = new Date();

    clearTimeout(hideTimeout);
    clearTimeout(resetTimeout);

    if (!nameRegex.test(name)) {
        showMessage('Введіть правильне ім’я (тільки букви, мінімум 3 символи)!', false);
        return;
    }

    if (!phoneRegex.test(phone)) {
        showMessage('Введіть правильний номер телефону у форматі +380123456789!', false);
        return;
    }

    if (selectedDateTime <= currentDateTime) {
        showMessage('Виберіть дату і час у майбутньому!', false);
        return;
    }

    showMessage('Завантаження...', true);

    message.classList.remove('invisible');

    const response = await fetch('api/post-consultation-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, datetime: selectedDateTime.toISOString() })
    });
    const result = await response.json();
    showMessage(result.success ? result.message : 'Помилка: ' + result.message, result.success);

    if (result.success) {
        consultationForm.reset();
    }

    messageClose.onclick = () => {
        message.classList.add('invisible');
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    };
});

function showMessage(text, isSuccess) {
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
