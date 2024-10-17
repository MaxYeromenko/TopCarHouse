if (!isAuthTokenExpired()) {
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-section-open';
    adminButton.title = 'Відкрити адмін панель';
    adminButton.innerHTML = '<i class="fa-solid fa-user-tie"></i>';

    adminButton.addEventListener('click', () => {
        openAdminPanel();
    });

    document.querySelector('.open-section-button-container').appendChild(adminButton);
} else {
    removeToken('jwtToken');
}

function addPostElement(type) {
    let elementHtml = '';

    switch (type) {
        case 'title':
            elementHtml = '<input class="post-element" type="text" data-post-element-type="title" placeholder="Заголовок">';
            break;
        case 'text':
            elementHtml = '<textarea class="post-element" data-post-element-type="text" placeholder="Текст"></textarea>';
            break;
        case 'image':
            elementHtml = '<input class="post-element" type="text" data-post-element-type="image" placeholder="Посилання на зображення">';
            break;
    }

    document.getElementById('add-element-btn').insertAdjacentHTML('beforebegin', elementHtml);
}

function openAdminPanel() {
    const adminPanelContent = `
        <div id="admin-container" class="modal-window-element">
            <h2>Конструктор статті</h2>
            <form id="create-post-form">
                <input type="text" id="post-title" placeholder="Заголовок" required>
                <button id="add-element-btn">Додати елемент</button>
                <input type="text" id="post-author" placeholder="Автор" required>
                <input type="text" id="post-tags" placeholder="Теги через кому">
                <button type="submit">Опублікувати статтю</button>
            </form>
        </div>
    `;

    modalWindow.insertAdjacentHTML('beforeend', adminPanelContent);

    const addElementBtn = document.getElementById('add-element-btn');
    addElementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = prompt('Введите тип элемента (title, text, image)');
        addPostElement(type);
    });

    addElementBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';

    const adminPanel = modalWindow.querySelector('#admin-container');
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(adminPanel, 'block');

    document.getElementById('create-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value.trim();
        const author = document.getElementById('post-author').value.trim();
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());

        const elements = Array.from(document.querySelectorAll('.post-element')).map(el => {
            const type = el.getAttribute('data-post-element-type');
            const content = el.value;
            return { type, content };
        });

        console.log(elements);

        try {
            const result = await fetchWithRetryPost('/api/api-blog-post-control', {
                title, structure: elements, author, tags
            }, retriesLimit);

            if (result.success) {
                showMessage(result.message, result.success);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
    });
}
