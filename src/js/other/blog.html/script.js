import { createConsultationRequest, themeApplication, showServicesModalWindow } from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();

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
                const elementContent = el.value.trim();
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

const blogSection = document.querySelector('.blog-section');
const postsContainer = document.createElement('div');
postsContainer.className = 'posts-container';
blogSection.appendChild(postsContainer);
const cardsSectionButtons = document.createElement('div');
cardsSectionButtons.className = 'cards-section-buttons';
blogSection.appendChild(cardsSectionButtons);
const loadMorePostsButton = document.createElement('button');
loadMorePostsButton.textContent = 'Завантажити більше';
cardsSectionButtons.appendChild(loadMorePostsButton);

let postsData = [];
let postsDisplayed = 0;
const postsPerPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await fetchWithRetry('/api/api-blog-post-control', retriesLimit);

        if (result) {
            postsData = result;
            loadMorePosts();
        }
    } catch (error) {
        console.error('Error fetching posts data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

function loadMorePosts() {
    const nextPosts = postsData.slice(postsDisplayed, postsDisplayed + postsPerPage);

    nextPosts.forEach(post => {
        postsContainer.appendChild(createPostCard(post));
    });

    postsDisplayed += nextPosts.length;

    if (postsDisplayed >= postsData.length) toggleElementVisibility(loadMorePostsButton, 'none');
}

function createPostCard(post) {
    const card = document.createElement('div');

    let description = 'Опис статті відсутній.';

    for (const element of post.structure) {
        if (element.elementType === 'text' && element.elementContent.trim() !== '') {
            description = element.elementContent.substring(0, 100) + '...';
            break;
        }
    }

    card.innerHTML = `
    <div class="blog-post-card">
        <div class="blog-post-info">
            <h2 class="blog-post-title">${post.title}</h2>
            <p class="blog-post-date">Дата публікації: 
                <span>
                ${new Date(post.publishedDate).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </p>
            <p class="blog-post-description">${description}</p>
            <a href="/pages/post-info.html?id=${post._id}" target="_blank" class="blog-post-read-more">
                Детальніше <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    </div>`;

    return card;
}

loadMorePostsButton.addEventListener('click', loadMorePosts);