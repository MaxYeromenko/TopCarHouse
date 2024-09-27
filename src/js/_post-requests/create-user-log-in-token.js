document.querySelector('#login-box form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (result.success) {
            localStorage.setItem('jwtToken', result.token);
            toggleButtonsVisibility(false);
            showMessage(result.message, true);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});
