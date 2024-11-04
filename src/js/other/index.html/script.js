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
    const { role } = getUserIdRoleFromToken();
    if (role === 'admin') {
        const adminButton = document.createElement('button');
        adminButton.id = 'admin-section-open';
        adminButton.title = 'Відкрити адмін панель';
        adminButton.innerHTML = '<i class="fa-solid fa-user-tie"></i>';

        adminButton.addEventListener('click', openAdminPanel);
        document.querySelector('.open-section-button-container').appendChild(adminButton);
    }
}

function openAdminPanel() {
    if (!document.getElementById('admin-container')) {
        const adminPanelContent = `
        <div id="admin-container" class="modal-window-element">
            <h2>Додавання автомобіля</h2>
            <form>
                <input type="text" id="brand" name="brand" placeholder="Бренд" required>
                <input type="text" id="model" name="model" placeholder="Модель" required>
                <input type="number" id="year" name="year" min="1886" max="2024" placeholder="Рік випуску" required>
                <input type="number" id="price" name="price" placeholder="Ціна (дол. США)" required>
                <input type="text" id="color" name="color" placeholder="Колір" required>
                <textarea id="description" name="description" placeholder="Опис" required></textarea>
                <input type="text" id="country" name="country" placeholder="Країна-виробник" required>
                <input type="file" id="images" name="images" accept="image/*" title="Завантажте до 5 зображень авто" multiple required>
                <input type="text" id="transmission" name="transmission" placeholder="Коробка передач" required>
                <input type="text" id="engine" name="engine" placeholder="Об'єм двигуна (л)" required>
                <input type="text" id="fuel_type" name="fuel_type" placeholder="Тип пального" required>
                <input type="number" id="horsepower" name="horsepower" placeholder="Потужність (к. с.)" required>
                <input type="number" id="fuel_consumption" name="fuel_consumption" placeholder="Споживання пального (л/100км)" required>
                <input type="text" id="body_type" name="body_type" placeholder="Тип кузова" required>
                <button type="submit">Зберегти автомобіль</button>
            </form>
        </div>`;
        modalWindow.insertAdjacentHTML('beforeend', adminPanelContent);

        initializeFormSubmission();
    }

    const adminPanel = modalWindow.querySelector('#admin-container');
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(adminPanel, 'block');
};

function initializeFormSubmission() {
    modalWindow.querySelector('#admin-container form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const images = formData.getAll('images');
        const imageUrls = [];

        for (const image of images) {
            const formDataCloudinary = new FormData();
            formDataCloudinary.append('file', image);
            formDataCloudinary.append('upload_preset', 'ml_default');
            formDataCloudinary.append('folder', 'cars');

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/dukwtlvte/image/upload`, {
                    method: 'POST',
                    body: formDataCloudinary
                });

                const data = await response.json();
                if (data.secure_url) {
                    imageUrls.push(data.secure_url);
                    console.log(imageUrls);
                }
            }
            catch (error) {
                console.log(error);
                showMessage(error.message, false);
            }
        }
        showMessage('Дані успішно відправлено!', true);

        // const carData = {
        //     brand: formData.get('brand'),
        //     model: formData.get('model'),
        //     year: formData.get('year'),
        //     price: formData.get('price'),
        //     color: formData.get('color'),
        //     description: formData.get('description'),
        //     country: formData.get('country'),
        //     images: imageUrls,
        //     features: {
        //         transmission: formData.get('transmission'),
        //         engine: formData.get('engine'),
        //         fuel_type: formData.get('fuel_type'),
        //         horsepower: formData.get('horsepower'),
        //         fuel_consumption: formData.get('fuel_consumption'),
        //         body_type: formData.get('body_type')
        //     }
        // };

        // await fetch('/api/cars', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(carData)
        // });
    });
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