const indexHeader = `<header>
        <div class="logo-bg">
            <a href="/">TopCarHouse</a>
        </div>
        <nav class="horizontal-nav">
            <a href="/pages/catalog.html">Каталог</a>
            <a class="services-button">Послуги</a>
            <a href="/pages/about.html">Про нас</a>
            <a href="/pages/blog.html">Блог</a>
            <a href="/pages/contacts.html">Контакти</a>
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
                <a href="/pages/contacts.html">Контакти</a>
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
            <a href="/pages/contacts.html">Контакти</a>
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
                <a href="/pages/contacts.html">Контакти</a>
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

const consultationСontainer = document.getElementById('consultation-container');
if (consultationСontainer) {
    consultationСontainer.insertAdjacentHTML('afterbegin', `
        <h2>Заява на отримання консультації</h2>
        <form id="consultation-form">
            <input id="consultation-name" type="text" placeholder="Як до Вас звертатись" title="Ім'я" required>
            <input id="consultation-phone" type="tel" placeholder="Номер телефону" title="Номер телефону"
                required>
            <input id="consultation-date" type="date" title="Дата проведення консультації" required>
            <input id="consultation-time" type="time" title="Час проведення консультації" required>
            <button type="submit">Подати заяву</button>
            <p class="consultation-alert"><span>*</span> Зверніть увагу: обраний час не є точним часом
                дзвінка. Можливі затримки, якщо всі оператори будуть зайняті.
            </p>
        </form>
        <p>Переглянути всі <a id="view-all-consultation-requests">консультації</a></p>
        `);
}

const calculatorContainer = document.getElementById('calculator-container');
if (calculatorContainer)
    calculatorContainer.insertAdjacentHTML('afterbegin', `
        <div id="credit-box">
            <h2>Кредитний калькулятор</h2>
            <form>
                <input type="number" min="0" id="creditAmount" placeholder="Сума кредиту (грн)" title="Сума кредиту" step="0.1" required>
                <input type="number" min="0" id="creditTerm" placeholder="Термін (місяці)" title="Термін" required>
                <input type="number" min="0" id="creditRate" placeholder="Відсоткова ставка (%)" step="0.1" title="Відсоткова ставка" required>
                <select id="paymentType">
                    <option value="annuity">Аннуїтетний</option>
                    <option value="differentiated">Диференційований</option>
                </select>
                <button type="submit">Розрахувати кредит</button>
            </form>
            <p>Калькулятор <a id="toggle-leasing">лізингу</a></p>
        </div>

        <div id="leasing-box">
            <h2>Лізинговий калькулятор</h2>
            <form>
                <input type="number" min="0" id="contractAmount" placeholder="Вартість авто (грн)" title="Вартість авто" step="0.1" required>
                <input type="number" min="0" id="interestRate" placeholder="Відсоток за кредитом (%)" title="Відсоток за кредитом" step="0.1"
                    required>
                <input type="number" min="0" id="advance" placeholder="Аванс (%)" title="Аванс" step="0.1" required>
                <input type="number" min="0" id="leaseTerm" placeholder="Термін (місяці)" title="Термін" required>
                <input type="number" min="0" id="insurance" placeholder="Страхування на місяць (грн)" title="Страхування на місяць" step="0.1"
                    required>
                <button type="submit">Розрахувати лізинг</button>
            </form>
            <p>Калькулятор <a id="toggle-credit">кредиту</a></p>
        </div>

        <result></result>`);

const themeContainer = document.getElementById('theme-container');
if (themeContainer)
    themeContainer.insertAdjacentHTML('afterbegin', `
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

const pageFooter = `<footer>
        <p>Контакти: +38 (057) 123-45-67 | TopCarHouse313@gmail.com</p>
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

    const consultationDate = document.getElementById('consultation-date');
    const consultationTime = document.getElementById('consultation-time');

    if (consultationDate && consultationTime) {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        const hours = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        consultationDate.min = today.toISOString().split('T')[0];
        consultationDate.max = nextMonth.toISOString().split('T')[0];

        consultationTime.min = currentTime;
    }
});

const headerBlock = document.querySelector('header');

function setMargin() {
    mainBlock.style.marginTop = headerBlock.getBoundingClientRect().height - 1 + 'px';
};

setMargin();
window.addEventListener('resize', setMargin);