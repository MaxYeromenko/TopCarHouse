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
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';

    const titleElement = document.createElement('h1');
    titleElement.textContent = postData.title;
    postContainer.appendChild(titleElement);

    const authorElement = document.createElement('p');
    const publishedDate = new Date(postData.publishedDate).toLocaleDateString();
    authorElement.textContent = `Автор: ${postData.author} | Опубликовано: ${publishedDate}`;
    postContainer.appendChild(authorElement);

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
                element = document.createElement('img');
                element.src = item.elementContent;
                element.alt = 'Изображение статьи';
                break;
            default:
                element = document.createElement('p');
                element.textContent = item.elementContent;
        }

        postContainer.appendChild(element);
    });

    if (postData.tags.length > 0) {
        const tagsElement = document.createElement('p');
        tagsElement.textContent = `Теги: ${postData.tags.join(', ')}`;
        postContainer.appendChild(tagsElement);
    }

    if (postData.commentsEnabled) {
        const commentsSection = document.createElement('section');
        commentsSection.classList.add('comments-section');

        const commentsTitle = document.createElement('h2');
        commentsTitle.textContent = 'Комментарии:';
        commentsSection.appendChild(commentsTitle);

        postData.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const commentator = document.createElement('p');
            commentator.textContent = `Комментатор: ${comment.commentator}`;
            commentElement.appendChild(commentator);

            const commentText = document.createElement('p');
            commentText.textContent = comment.commentText;
            commentElement.appendChild(commentText);

            const commentDate = document.createElement('p');
            commentDate.textContent = `Дата: ${new Date(comment.createdAt).toLocaleDateString()}`;
            commentElement.appendChild(commentDate);

            commentsSection.appendChild(commentElement);
        });

        postContainer.appendChild(commentsSection);
    }
};