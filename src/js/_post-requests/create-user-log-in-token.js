document.querySelector('.auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetchWithRetryPost('/api/get-user', { email, password }, retriesLimit);

        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            localStorage.setItem('jwtToken', data.token);
            window.location.href = '/index.html';
        } else {
            const errorMessage = response.ok ? 'Ответ не в формате JSON' : `Ошибка: ${response.status}`;
            console.error(errorMessage);
            alert('Ошибка входа: ' + errorMessage);
        }
    } catch (error) {
        console.error('Ошибка сервера:', error);
        alert('Ошибка сервера');
    }
});
