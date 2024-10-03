document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();

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