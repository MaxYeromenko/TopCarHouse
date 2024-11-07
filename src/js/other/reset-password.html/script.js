const resetPasswordBox = document.getElementById('reset-password-box');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

resetPasswordBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = String(event.target.querySelector('input[name="new-password"]').value).trim();
    const confirmPassword = String(event.target.querySelector('input[name="confirm-password"]').value).trim();

    if (newPassword !== confirmPassword) {
        showMessage('Паролі не співпадають!', false);
        return;
    }

    if (!passwordRegex.test(newPassword)) {
        showMessage('Пароль має містити 8 символів, щонайменше 1 велику та маленьку літери та 1 цифру!', false);
        return;
    }

    showMessage('Скидання пароля...', true);

    try {
        const result = await fetchWithRetryPost('/api/reset-password', { token, newPassword }, retriesLimit);

        if (result.success) {
            event.target.reset();
            showMessage('Пароль успішно змінений! Тепер ви можете увійти.', true);
            window.location.href = '/';
        } else {
            showMessage(result.message, false);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});