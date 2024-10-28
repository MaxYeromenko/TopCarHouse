import {
    createConsultationRequest,
    themeApplication,
    showServicesModalWindow
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');
let postData;

document.addEventListener("DOMContentLoaded", async () => {
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetry(`/api/api-blog-post-control?id=${postId}`, retriesLimit);

        if (result) {
            postData = result[0];
            loadPostInfo();
            showMessage('Дані успішно завантажені!', true);
        }
    } catch (error) {
        console.error('Error fetching post data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

function loadPostInfo() {
    document.title = `${postData.title} | TopCarHouse`;
    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = '';
    const postContentContainer = document.createElement('section');
    postContentContainer.className = 'post-content-container';
    postContainer.appendChild(postContentContainer);

    const titleElement = document.createElement('h1');
    titleElement.textContent = postData.title;
    postContentContainer.appendChild(titleElement);

    const authorElement = document.createElement('p');
    const publishedDate = new Date(postData.publishedDate).toLocaleDateString();
    authorElement.textContent = `Автор: ${postData.author} | Дата публікації: ${publishedDate}`;
    postContentContainer.appendChild(authorElement);

    postData.structure.forEach(item => {
        let element;
        switch (item.elementType) {
            case 'title':
                element = document.createElement('h3');
                element.textContent = item.elementContent;
                break;
            case 'text':
                element = document.createElement('p');
                element.textContent = item.elementContent;
                break;
            case 'image':
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const image = document.createElement('img');
                image.src = item.elementContent;
                image.alt = 'Зображення статті';
                imageContainer.appendChild(image);
                element = imageContainer;
                break;
            default:
                element = document.createElement('p');
                element.textContent = item.elementContent;
        }

        postContentContainer.appendChild(element);
    });

    if (postData.tags.length > 0) {
        const tagsElement = document.createElement('p');
        tagsElement.textContent = `Теги: ${postData.tags.join(', ')}`;
        postContentContainer.appendChild(tagsElement);
    }

    if (postData.commentsEnabled) {
        const commentsSection = document.createElement('section');
        commentsSection.classList.add('comments-section');

        const commentsTitle = document.createElement('h2');
        commentsTitle.textContent = 'Коментарі';
        commentsSection.appendChild(commentsTitle);

        const addCommentSection = `<div id="add-comment-section">
                <textarea id="comment-text" placeholder="Напишіть свій коментар..." required></textarea>
                <button id="submit-comment">Додати коментар</button>
            </div>`;
        commentsSection.insertAdjacentHTML('beforeend', addCommentSection);

        commentsSection.querySelector('#submit-comment').addEventListener('click', () => {
            submitComment(postId);
        });

        postData.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const commentator = document.createElement('p');
            commentator.className = 'commentator-name';
            commentator.innerHTML = `${comment.commentator.name}, <span>${new Date(comment.createdAt).toLocaleString()}</span>`;
            commentElement.appendChild(commentator);

            const commentText = document.createElement('p');
            commentText.className = 'comment-text';
            commentText.textContent = comment.commentText;
            commentElement.appendChild(commentText);

            commentsSection.appendChild(commentElement);
        });

        postContainer.appendChild(commentsSection);
    }
};

async function submitComment(postId) {
    const commentText = document.getElementById('comment-text').value.trim();

    if (!commentText) {
        showMessage('Коментар не може бути порожнім!', false);
        return;
    }

    if (isAuthTokenExpired()) {
        showMessage('Увійдіть до облікового запису, щоб мати змогу коментувати!', false);
        return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
        showMessage('Помилка, перезайдіть до облікового запису!', false);
        return;
    }

    showMessage('Публікація...', true)
    try {
        const result = await handleRequest(`/api/add-post-comment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    commentText
                })
            }, retriesLimit);

        if (result.success) {
            showMessage('Коментар успішно опубліковано!', true);
            document.getElementById('comment-text').value = '';
            loadPostInfo();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
}