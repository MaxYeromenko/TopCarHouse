applySavedTheme();

const indexHeader = `<header>
        <div class="logo-bg">
            <a href="/">TopCarHouse</a>
        </div>
        <nav class="horizontal-nav">
            <a href="/pages/catalog.html">Каталог</a>
            <a class="services-button">Послуги</a>
            <a href="/pages/about.html">Про нас</a>
            <a href="/pages/blog.html">Блог</a>
            <a href="#bottom">Контакти</a>
            <a class="log-button">Увійти</a>
            <a class="log-out-button">Вийти</a>
        </nav>
        <div class="icon-wrapper">
            <i class="fa-solid fa-angles-down"></i>
            <i class="fa-solid fa-angles-up"></i>
            <nav class="vertical-nav">
                <a href="/pages/catalog.html">Каталог</a>
                <a class="services-button">Послуги</a>
                <a href="/pages/about.html">Про нас</a>
                <a href="/pages/blog.html">Блог</a>
                <a href="#bottom">Контакти</a>
                <a class="log-button">Увійти</a>
                <a class="log-out-button">Вийти</a>
            </nav>
        </div>
        <div class="consultation-button-bg">
            <button id="consultation-button">Отримати консультацію</button>
        </div>
    </header>`;
const pageHeader = `<header>
        <div class="logo-bg">
            <a href="/">TopCarHouse</a>
        </div>
        <nav class="horizontal-nav">
            <a href="/">Головна</a>
            <a href="/pages/catalog.html">Каталог</a>
            <a class="services-button">Послуги</a>
            <a href="/pages/about.html">Про нас</a>
            <a href="/pages/blog.html">Блог</a>
            <a href="#bottom">Контакти</a>
        </nav>
        <div class="icon-wrapper">
            <i class="fa-solid fa-angles-down"></i>
            <i class="fa-solid fa-angles-up"></i>
            <nav class="vertical-nav">
                <a href="/">Головна</a>
                <a href="/pages/catalog.html">Каталог</a>
                <a class="services-button">Послуги</a>
                <a href="/pages/about.html">Про нас</a>
                <a href="/pages/blog.html">Блог</a>
                <a href="#bottom">Контакти</a>
            </nav>
        </div>
        <div class="consultation-button-bg">
            <button id="consultation-button">Отримати консультацію</button>
        </div>
    </header>`;
document.body.insertAdjacentHTML('afterbegin', document.location.pathname === '/' ? indexHeader : pageHeader);

const messageMarkUp = `<div class="info-message">
        <span class="message-text"></span>
        <i class="fa-solid fa-xmark"></i>
    </div>`;
document.querySelector('main').insertAdjacentHTML('afterbegin', messageMarkUp);

const pageFooter = `<footer id="bottom">
        <p>Контакти: +38 (044) 123-45-67 | TopCarHouse313@gmail.com</p>
        <p>Адреса: м. Харків, вул. Автомобільна, 1</p>
        <p>&copy; 2024 TopCarHouse. Усі права захищені.</p>
        <p>
            <a href="https://www.facebook.com/profile.php?id=61567498883455" target="_blank">
                Facebook
            </a> |
            <a href="https://www.instagram.com/topcarhouse313" target="_blank">
                Instagram
            </a> |
            <a href="https://youtube.com/@topcarhouse?si=8Oi7ULpXNZvLYfd0" target="_blank">
                YouTube
            </a>
        </p>
    </footer>`;

document.querySelector('main').insertAdjacentHTML('afterend', pageFooter);


document.addEventListener('DOMContentLoaded', () => {
    const head = document.querySelector('head');

    const existingIcons = head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingIcons.forEach(icon => head.removeChild(icon));

    const pageIcon = document.createElement('link');
    pageIcon.setAttribute('rel', 'icon');
    pageIcon.setAttribute('type', 'image/png');
    pageIcon.setAttribute('sizes', '256x256');
    pageIcon.setAttribute('href', 'https://res.cloudinary.com/dukwtlvte/image/upload/v1727693527/topcarhouse-favicon-color-256x256_mf8lcb.png');

    head.appendChild(pageIcon);
});

let headerBlock = document.querySelector('header');
let mainBlock = document.querySelector('main');

function setMargin() {
    let headerBlockHeight = headerBlock.getBoundingClientRect().height;
    mainBlock.style.marginTop = headerBlockHeight - 1 + 'px';
};

setMargin();
window.addEventListener('resize', setMargin);