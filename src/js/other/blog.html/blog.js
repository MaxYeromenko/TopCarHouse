if (!isAuthTokenExpired()) {
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-section-open';
    adminButton.title = 'Відкрити адмін панель';
    adminButton.innerHTML = '<i class="fa-solid fa-user-tie"></i>';

    adminButton.addEventListener('click', () => {
        openAdminPanel();
    });

    document.querySelector('.open-section-button-container').appendChild(adminButton);
}
else {
    removeToken('jwtToken');
}

function openAdminPanel() {
    const adminPanelContent = `
        <div id="admin-container" class="modal-window-element">
            <h2>Створити нову статтю</h2>
            <form id="create-post-form">
                <input type="text" id="post-title" placeholder="Заголовок" required>
                <textarea id="post-content" placeholder="Контент" required></textarea>
                <input type="text" id="post-author" placeholder="Автор" required>
                <input type="text" id="post-images" placeholder="Введіть URL, розділені комами">
                <input type="text" id="post-tags" placeholder="Теги через кому">
                <button type="submit">Опублікувати статтю</button>
            </form>
        </div>
    `;
    modalWindow.insertAdjacentHTML('beforeend', adminPanelContent);
    const adminPanel = modalWindow.querySelector('#admin-container');
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(adminPanel, 'block');

    document.getElementById('create-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const author = document.getElementById('post-author').value;
        const images = document.getElementById('post-images').value.split(',').map(image => image.trim());
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());

        try {
            const result = await fetchWithRetryPost('/api/api-blog-post-control',
                {
                    title, content, author, images, tags
                }, retriesLimit);

            if (result.success) {
                showMessage(result.message, result.success);
                hideAllElementsInModalWindow(modalWindow);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
    });
}