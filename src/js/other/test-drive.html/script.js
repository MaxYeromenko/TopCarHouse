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

    updateTestDrives();
});

function inputHints(preOrderTypes) {
    const sortedCars = [...preOrderTypes.preOrderCars];

    const carOptions = document.getElementById('car-options');
    carOptions.innerHTML = '';
    sortedCars.forEach(car => {
        const option = document.createElement('option');
        option.value = `${car.brand} ${car.model}`;
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

const testDrivesContainer = modalWindow.querySelector('#test-drives-container');

document.getElementById('view-all-test-drives').addEventListener('click', () => {
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(testDrivesContainer, 'block');
});

async function updateTestDrives() {
    showMessage('Завантаження записів...', true);
    try {
        const { id } = getUserIdRoleFromToken();
        if (!id) {
            showMessage('Помилка, перезайдіть до облікового запису!', false);
            return;
        }

        const cacheKey = 'testDrivesCache';
        const result = await fetchWithCache(`/api/api-test-drive-control?id=${id}`, cacheKey, cacheExpiration, retriesLimit);

        if (result) {
            fillTestDriveColumns(result);
            showMessage('Запити на тест-драйви успішно завантажені!', true);
        }
    } catch (error) {
        showMessage(error.message, false);
    }
};

function fillTestDriveColumns(testDrives) {
    const newTestDrives = document.getElementById('new-test-drives');
    const inProcessTestDrives = document.getElementById('in-progress-test-drives');
    const completedTestDrives = document.getElementById('completed-test-drives');
    const cancelledTestDrives = document.getElementById('cancelled-test-drives');

    [newTestDrives, inProcessTestDrives, completedTestDrives, cancelledTestDrives].forEach(column => column.innerHTML = '');

    testDrives.forEach(testDrive => {
        const testDriveMarkup = `
            <div class="test-drive">
                <span>${testDrive.name}</span>
                <span>${testDrive.phone}</span>
                <span>${testDrive.car ? `${testDrive.car.brand} ${testDrive.car.model}, $${testDrive.car.price}` : 'Автомобіль не вказаний'}</span>
                ${testDrive.status === 'new' ? `<button class="cancel-test-drive" data-id="${testDrive._id}"><i class="fa-solid fa-ban"></i></button>` : ''}
            </div>`;

        switch (testDrive.status) {
            case 'new':
                newTestDrives.insertAdjacentHTML('afterbegin', testDriveMarkup);
                break;
            case 'in-progress':
                inProcessTestDrives.insertAdjacentHTML('afterbegin', testDriveMarkup);
                break;
            case 'completed':
                completedTestDrives.insertAdjacentHTML('afterbegin', testDriveMarkup);
                break;
            case 'cancelled':
                cancelledTestDrives.insertAdjacentHTML('afterbegin', testDriveMarkup);
                break;
        };

        document.querySelectorAll('.cancel-test-drive').forEach(element => {
            if (!element.hasAttribute('listener-attached')) {
                element.addEventListener('click', event => cancelTestDrive(event.target.dataset.id));
                element.setAttribute('listener-attached', 'true');
            }
        });
    });
};

async function cancelTestDrive(testDriveId) {
    showMessage('Змінюємо статус ...', true);

    try {
        const result = await fetchWithRetryPost(`/api/api-test-drive-control`, { testDriveId }, retriesLimit);

        if (result.success) {
            showMessage(result.message, true);
            document.querySelector(`.test-drive button[data-id="${testDriveId}"]`).parentElement.remove();
            removeTokens(['testDrivesCache']);
            updateTestDrives();
        } else {
            showMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error canceling test drive:', error);
        showMessage('Помилка при скасуванні запису на тест драйв!', false);
    }
}

const nameRegex = /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ\s]{3,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const phoneRegex = /^\+380\d{9}$/;
const testDriveBox = document.getElementById('test-drive-box');

document.querySelector('input[name="phone"]').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9+]/g, '');
    if (this.value.indexOf('+') > 0) {
        this.value = this.value.replace(/\+/g, '');
    }

    if (this.value.indexOf('+') === 0 && this.value.slice(1).includes('+')) {
        this.value = '+' + this.value.slice(1).replace(/\+/g, '');
    }
});

testDriveBox.querySelector('form').addEventListener('submit', async event => {
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
        const result = await fetchWithRetryPost(`/api/api-test-drive-control`, formObject, retriesLimit);

        if (result.success) {
            showMessage(result.message, true);
            event.target.reset();
            removeTokens(['testDrivesCache']);
            updateTestDrives();
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});