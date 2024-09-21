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
const nameRegex = /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ\s]{3,}$/;
const phoneRegex = /^\+380\d{9}$/;
const messageClose = document.querySelector('.info-message .fa-xmark');
const message = document.querySelector('.info-message');

consultationForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('consultation-name').value.trim();
    const phone = document.getElementById('consultation-phone').value;
    const dateInput = document.getElementById('consultation-date').value;
    const timeInput = document.getElementById('consultation-time').value;
    const selectedDateTime = new Date(`${dateInput}T${timeInput}`);
    const currentDateTime = new Date();

    if (!nameRegex.test(name)) {
        showMessage('Введіть правильне ім’я (тільки букви, мінімум 3 символи)!', false);
        return;
    }

    if (!phoneRegex.test(phone)) {
        showMessage('Введіть правильний номер телефону у форматі +380123456789!', false);
        return;
    }

    if (isNaN(selectedDateTime.getTime())) {
        showMessage('Виберіть коректну дату і час!', false);
        return;
    }

    if (selectedDateTime <= currentDateTime) {
        showMessage('Виберіть дату і час у майбутньому!', false);
        return;
    }

    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost(`/api/post-consultation-request`,
            {
                name, phone, datetime: selectedDateTime.toISOString()
            }, retriesLimit);

        if (result.success) {
            showMessage(result.message, result.success);
            consultationForm.reset();
        } else {
            showMessage('Помилка: Невідома помилка під час завантаження даних', false);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }

    messageClose.onclick = () => {
        message.classList.add('invisible');
        message.classList.remove('error-message');
        message.classList.remove('success-message');
    };
});
