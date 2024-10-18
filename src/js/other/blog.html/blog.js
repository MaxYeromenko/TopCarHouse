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

function openAdminPanel() {
    if (!document.getElementById('admin-container')) {
        const adminPanelContent = `
        <div id="admin-container" class="modal-window-element">
            <h2>Конструктор статті</h2>
            <form>
                <input type="text" id="post-title" placeholder="Заголовок статті" required>
                <button id="add-element-btn"></button>
                <button id="remove-element-btn"></button>
                <input type="text" id="post-author" placeholder="Автор" required>
                <input type="text" id="post-tags" placeholder="Теги через кому">
                <label>
                    <input type="checkbox" id="post-comments-enabled">
                    <span class="checkbox-button"></span>
                    Увімкнути коментарі
                </label>
                <button type="submit">Опублікувати статтю</button>
            </form>
            <div id="element-type-select">
                <h2>Оберіть тип елемента</h2>
                <div class="element-type-list">
                    <div class="element-type" data-element-type="title">
                        <i class="fa-solid fa-heading"></i>
                        <span>Заголовок</span>
                    </div>
                    <div class="element-type" data-element-type="text">
                        <i class="fa-solid fa-align-center"></i>
                        <span>Текст</span>
                    </div>
                    <div class="element-type" data-element-type="image">
                        <i class="fa-solid fa-image"></i>
                        <span>Зображення</span>
                    </div>
                </div>
                <button>Закрити</button>
            </div>
        </div>`;
        modalWindow.insertAdjacentHTML('beforeend', adminPanelContent);

        initializeElementTypeSelection();
        initializeAddElementButton();
        initializeRemoveElementButton();
        initializeFormSubmission();
    }

    const adminPanel = modalWindow.querySelector('#admin-container');
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(adminPanel, 'block');
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

function initializeElementTypeSelection() {
    const elementTypeSelect = document.getElementById('element-type-select');

    elementTypeSelect.querySelector('button').addEventListener('click', () => {
        toggleElementVisibility(elementTypeSelect, 'none');
    });

    elementTypeSelect.querySelectorAll('.element-type').forEach(element => {
        element.addEventListener('click', () => {
            const elementType = element.getAttribute('data-element-type');
            addPostElement(elementType);
        });
    });
}

function initializeAddElementButton() {
    const addElementBtn = document.getElementById('add-element-btn');
    addElementBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    addElementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleElementVisibility(document.getElementById('element-type-select'), 'flex');
    });
}

function initializeRemoveElementButton() {
    const removeElementBtn = document.getElementById('remove-element-btn');
    const addElementBtn = document.getElementById('add-element-btn');
    let isDeleteMode = false;

    removeElementBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    removeElementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isDeleteMode = !isDeleteMode;

        if (isDeleteMode) {
            removeElementBtn.classList.add('delete-button-active');
            addElementBtn.disabled = true;
            enableDeleteMode();
        } else {
            removeElementBtn.classList.remove('delete-button-active');
            addElementBtn.disabled = false;
            disableDeleteMode();
        }
    });
}

function enableDeleteMode() {
    const postElements = document.querySelectorAll('.post-element');
    postElements.forEach(element => {
        element.classList.add('delete-mode');
        element.addEventListener('click', deleteElement);
    });
}

function disableDeleteMode() {
    const postElements = document.querySelectorAll('.post-element');
    postElements.forEach(element => {
        element.classList.remove('delete-mode');
        element.removeEventListener('click', deleteElement);
    });
}

function deleteElement(e) {
    e.target.remove();
}

function initializeFormSubmission() {
    const adminPanel = modalWindow.querySelector('#admin-container');
    const constructorForm = adminPanel.querySelector('form');

    constructorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value.trim();
        const author = document.getElementById('post-author').value.trim();
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
        const commentsEnabled = document.getElementById('post-comments-enabled').checked;
        const postElements = document.querySelectorAll('.post-element');

        const elements = Array.from(postElements)
            .map(el => {
                const elementType = el.getAttribute('data-post-element-type');
                const elementContent = el.value;
                return { elementType, elementContent };
            })
            .filter(el => el.elementContent !== '');

        showMessage('Завантаження...', true);
        try {
            const result = await fetchWithRetryPost('/api/api-blog-post-control', {
                title, structure: elements, author, tags, commentsEnabled
            }, retriesLimit);

            if (result.success) {
                showMessage(result.message, result.success);
                constructorForm.reset();
                hideAllElementsInModalWindow(modalWindow);
                postElements.forEach(element => element.remove());
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
    });
}
