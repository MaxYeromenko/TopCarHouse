if (isAuthTokenExpired()) window.location.href = '/';

import {
    createConsultationRequest,
    themeApplication, showServicesModalWindow
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cacheKey = 'carsTypesCache';
        const result = await fetchWithCache('/api/get-car-types', cacheKey, cacheExpiration, retriesLimit);

        if (result) {
            inputHints(result);
        }
    } catch (error) {
        showMessage(error.message, false);
    }
});

function inputHints(preOrderTypes) {
    const sortedCars = [...preOrderTypes.preOrderCars];

    const carOptions = document.getElementById('car-options');
    carOptions.innerHTML = '';
    sortedCars.forEach(car => {
        const option = document.createElement('option');
        option.value = `${car.brand} ${car.model}, $${car.price}`;
        option.dataset.id = car.id;
        carOptions.appendChild(option);
    });
}

const carDisplayInput = document.querySelector('input[name="carDisplay"]');
const carIdInput = document.getElementById('carId');

carDisplayInput.addEventListener('change', () => {
    const selectedOption = document.querySelector(`#car-options option[value="${carDisplayInput.value}"]`);

    if (selectedOption) {
        carIdInput.value = selectedOption.dataset.id;
    } else {
        carIdInput.value = '';
    }
});

const nameRegex = /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ\s]{3,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const phoneRegex = /^\+380\d{9}$/;
const preOrderBox = document.getElementById('pre-order-box');

document.querySelector('input[name="phone"]').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9+]/g, '');
    if (this.value.indexOf('+') > 0) {
        this.value = this.value.replace(/\+/g, '');
    }

    if (this.value.indexOf('+') === 0 && this.value.slice(1).includes('+')) {
        this.value = '+' + this.value.slice(1).replace(/\+/g, '');
    }
});

preOrderBox.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();

    const { id } = getUserIdRoleFromToken();
    if (!id) {
        showMessage('Помилка, перезайдіть до облікового запису!', false);
        return;
    }

    const formData = new FormData(event.target);
    const formObject = {};

    formObject.id = id;
    formData.forEach((value, key) => formObject[key] = value.trim());

    const { name, email, phone, car } = formObject;

    if (!nameRegex.test(name)) {
        showMessage('Введіть правильне ім’я (тільки букви, мінімум 3 символи)!', false);
        return;
    }

    if (!emailRegex.test(email)) {
        showMessage('Неправильний формат електронної пошти!', false);
        return;
    }

    if (!phoneRegex.test(phone)) {
        showMessage('Введіть правильний номер телефону у форматі +380123456789!', false);
        return;
    }

    if (!car) {
        showMessage('Оберіть автомобіль!', false);
        return;
    }

    showMessage('Завантаження...', true);
    
    try {
        const result = await fetchWithRetryPost(`/api/api-pre-order-control`, formObject, retriesLimit);

        if (result.success) {
            showMessage(result.message, result.success);
            event.target.reset();
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});