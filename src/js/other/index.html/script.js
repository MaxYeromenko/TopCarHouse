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
const requestResetBox = document.getElementById('request-reset-box');

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
                <input type="text" id="brand" name="brand" placeholder="Бренд" title="Бренд" required>
                <input type="text" id="model" name="model" placeholder="Модель" title="Модель" required>
                <input type="number" id="year" name="year" min="1886" max="2024" placeholder="Рік випуску" title="Рік випуску" required>
                <input type="number" min="0" id="price" name="price" placeholder="Ціна (дол. США)" title="Ціна" step="0.1" required>
                <input type="text" id="color" name="color" placeholder="Колір" title="Колір" required>
                <textarea id="description" name="description" placeholder="Опис" title="Опис" required></textarea>
                <input type="text" id="country" name="country" placeholder="Країна-виробник" title="Країна-виробник" required>
                <input type="file" id="images" name="images" accept="image/*" title="Завантажте до 5 зображень авто" multiple required>
                <input type="text" id="transmission" name="transmission" placeholder="Коробка передач" title="Коробка передач" required>
                <input type="number" min="0" id="engine" name="engine" placeholder="Об'єм двигуна (л)" title="Об'єм двигуна" step="0.1" required>
                <input type="text" id="fuel_type" name="fuel_type" placeholder="Тип пального" title="Тип пального" required>
                <input type="number" min="0" id="horsepower" name="horsepower" placeholder="Потужність (к. с.)" title="Потужність" required>
                <input type="number" min="0" id="fuel_consumption" name="fuel_consumption" placeholder="Споживання пального (л/100км)" title="Споживання пального" step="0.1" required>
                <input type="text" id="body_type" name="body_type" placeholder="Тип кузова" title="Тип кузова" required>
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
                const result = await handleRequest(`https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`, {
                    method: "POST",
                    body: formDataCloudinary
                }, retriesLimit);

                if (result.secure_url) {
                    imageUrls.push(result.secure_url);
                    showMessage(`Фото ${image.name} успішно відправлено!`, true);
                }
            }
            catch (error) {
                console.error(error);
                showMessage(`Фото ${image.name} не вдалося відправити!`, false);
            }
        };

        const carData = {
            brand: formData.get('brand').trim(),
            model: formData.get('model').trim(),
            year: formData.get('year').trim(),
            price: Math.abs(formData.get('price').trim()),
            color: formData.get('color').trim(),
            description: formData.get('description').trim(),
            country: formData.get('country').trim(),
            images: imageUrls,
            features: {
                transmission: formData.get('transmission').trim(),
                engine: Math.abs(formData.get('engine').trim()),
                fuel_type: formData.get('fuel_type').trim(),
                horsepower: Math.abs(formData.get('horsepower').trim()),
                fuel_consumption: formData.get('fuel_consumption').trim(),
                body_type: formData.get('body_type').trim()
            }
        };

        try {
            const result = await fetchWithRetryPost(`api/api-cars-control`,
                carData, retriesLimit);

            if (result) {
                removeToken('bestCarDealsCache');
                showMessage('Авто успішно додано!', true);
            }
        }
        catch (error) {
            console.error(error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
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

document.querySelectorAll('.toggle-login').forEach(element => {
    element.addEventListener('click', () => {
        toggleElementVisibility(registerBox, 'none');
        toggleElementVisibility(requestResetBox, 'none');
        toggleElementVisibility(loginBox, 'block');
    });
});

document.getElementById('toggle-reset-password').addEventListener('click', () => {
    toggleElementVisibility(loginBox, 'none');
    toggleElementVisibility(requestResetBox, 'block');
});

const loginRegex = /^[a-zA-Z0-9]{5,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

registerBox.querySelector('form').addEventListener('submit', async (event) => {
    e.preventDefault();

    const name = String(event.target.querySelector('input[type="text"]').value).trim();
    const email = String(event.target.querySelector('input[type="email"]').value).trim().toLowerCase();
    const password = String(event.target.querySelector('input[type="password"]').value).trim();

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
            event.target.reset();
            showMessage(result.message, result.success);
            toggleElementVisibility(registerBox, 'none');
            toggleElementVisibility(loginBox, 'block');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

loginBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = String(event.target.querySelector('input[type="email"]').value).trim();
    const password = String(event.target.querySelector('input[type="password"]').value).trim();
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (result.success) {
            event.target.reset();
            localStorage.setItem(authTokenName, result.token);
            toggleButtonsVisibility(false);
            showMessage(result.message, true);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

requestResetBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = String(event.target.querySelector('input[type="email"]').value).trim().toLowerCase();

    if (!emailRegex.test(email)) {
        showMessage('Неправильний формат електронної пошти!', false);
        return;
    }

    showMessage('Надсилаємо листа з інструкціями...', true);

    try {
        const result = await fetchWithRetryPost('/api/request-password-reset', { email }, retriesLimit);

        if (result.success) {
            showMessage('Лист надіслано! Перевірте електронну пошту.', true);
            event.target.reset();
        } else {
            showMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});