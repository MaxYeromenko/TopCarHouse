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

const mainBlock = document.querySelector('main');

const messageMarkUp = `<div class="info-message">
        <span class="message-text"></span>
        <i class="fa-solid fa-xmark"></i>
    </div>`;
mainBlock.insertAdjacentHTML('afterbegin', messageMarkUp);

document.getElementById('theme-container').insertAdjacentHTML('afterbegin', `
    <div class="theme-block">
        <span>Стандартна тема</span>
        <container data-theme="default-theme">
            <button>Застосувати</button>
            <div class="colors">
                <main-color>Головний</main-color>
                <secondary-color>Другорядний</secondary-color>
                <background-color>Фоновий</background-color>
            </div>
        </container>
    </div>
    <div class="theme-block">
        <span>Золотий акцент</span>
        <container data-theme="golden-accent-theme">
            <button>Застосувати</button>
            <div class="colors">
                <main-color>Головний</main-color>
                <secondary-color>Другорядний</secondary-color>
                <background-color>Фоновий</background-color>
            </div>
        </container>
    </div>
    <div class="theme-block">
        <span>Червоний акцент</span>
        <container data-theme="red-accent-theme">
            <button>Застосувати</button>
            <div class="colors">
                <main-color>Головний</main-color>
                <secondary-color>Другорядний</secondary-color>
                <background-color>Фоновий</background-color>
            </div>
        </container>
    </div>
    <div class="theme-block">
        <span>Фіолетово-жовта</span>
        <container data-theme="vibrant-purple-yellow-theme">
            <button>Застосувати</button>
            <div class="colors">
                <main-color>Головний</main-color>
                <secondary-color>Другорядний</secondary-color>
                <background-color>Фоновий</background-color>
            </div>
        </container>
    </div>
    <div class="theme-block">
        <span>Сіра тема</span>
        <container data-theme="gray-tone-theme">
            <button>Застосувати</button>
            <div class="colors">
                <main-color>Головний</main-color>
                <secondary-color>Другорядний</secondary-color>
                <background-color>Фоновий</background-color>
            </div>
        </container>
    </div>`);

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
mainBlock.insertAdjacentHTML('afterend', pageFooter);


document.addEventListener('DOMContentLoaded', () => {
    const head = document.querySelector('head');

    const existingIcons = head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingIcons.forEach(icon => head.removeChild(icon));

    const faviconIco = document.createElement('link');
    faviconIco.setAttribute('rel', 'icon');
    faviconIco.setAttribute('href', '/favicon.ico');
    faviconIco.setAttribute('type', 'image/x-icon');
    head.appendChild(faviconIco);

    const faviconPng = document.createElement('link');
    faviconPng.setAttribute('rel', 'icon');
    faviconPng.setAttribute('href', '/favicon.png');
    faviconPng.setAttribute('type', 'image/png');
    head.appendChild(faviconPng);
});

const headerBlock = document.querySelector('header');

function setMargin() {
    mainBlock.style.marginTop = headerBlock.getBoundingClientRect().height - 1 + 'px';
};

setMargin();
window.addEventListener('resize', setMargin);