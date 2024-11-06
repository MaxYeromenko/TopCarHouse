const resetPasswordBox = document.getElementById('reset-password-box');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

resetPasswordBox.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = String(event.target.querySelector('input[name="new-password"]').value).trim();
    const confirmPassword = String(event.target.querySelector('input[name="confirm-password"]').value).trim();

    if (newPassword !== confirmPassword) {
        showMessage('Пароли не совпадают!', false);
        return;
    }
    if (!passwordRegex.test(newPassword)) {
        showMessage('Пароль должен содержать минимум 8 символов, включая заглавную и строчную буквы и цифру!', false);
        return;
    }

    showMessage('Сброс пароля...', true);

    try {
        const result = await fetchWithRetryPost('/api/reset-password', { token, newPassword }, retriesLimit);

        if (result.success) {
            event.target.reset();
            showMessage('Пароль успешно сброшен! Теперь вы можете войти.', true);
            // Опционально перенаправить пользователя на страницу входа
            // window.location.href = '/login';
        } else {
            showMessage(result.message, false);
        }
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        showMessage('Ошибка сервера, попробуйте снова позже.', false);
    }
});