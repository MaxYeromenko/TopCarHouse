document.querySelector('.auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    try {
        const data = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (data.success) {
            localStorage.setItem('jwtToken', data.token);
            window.location.href = '/index.html';
        } else {
            console.error(data.message);
            alert('Ошибка входа: ' + data.message);
        }
    } catch (error) {
        console.error('Ошибка сервера:', error);
        alert('Ошибка сервера');
    }
});
