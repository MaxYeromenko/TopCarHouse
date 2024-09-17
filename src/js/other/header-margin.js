let headerBlock = document.querySelector('header');
let mainBlock = document.querySelector('main');

function setMargin() {
    let headerBlockHeight = headerBlock.getBoundingClientRect().height;
    mainBlock.style.marginTop = headerBlockHeight - 1 + 'px';
};

setMargin();
window.addEventListener('resize', setMargin);