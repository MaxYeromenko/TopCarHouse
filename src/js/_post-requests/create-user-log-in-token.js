document.querySelector('.auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    showMessage('Завантаження...', true);

    try {
        const data = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (data.success) {
            localStorage.setItem('jwtToken', data.token);
            window.location.href = '/';
            showMessage(data.message, true);
        } else {
            showMessage(`Помилка входу: ${data.message}`, false);
        }
    } catch (error) {
        console.error('Ошибка сервера:', error);
        showMessage(`Помилка входу: ${error.message}`, false);
    }
});
