const loginRegex = /^[a-zA-Z0-9]{5,}$/;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
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

    try {
        const result = await fetchWithRetryPost(`/api/post-user`,
            { name, email, password }, retriesLimit);

        if (result.success) {
            showMessage(result.message, result.success);
            form.reset();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        } else {
            showMessage('Помилка: Невідома помилка під час завантаження даних', false);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});
