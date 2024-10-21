import {
    createConsultationRequest,
    themeApplication,
    showServicesModalWindow,
    calculatorIntegration,
    compareCarsIntegration
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();
calculatorIntegration();
compareCarsIntegration();

const imageToView = document.getElementById('product-image');
const viewedImage = document.createElement('img');
viewedImage.classList.add('viewed-img');
viewedImage.classList.add('modal-window-element');
modalWindow.appendChild(viewedImage);

let currentScale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
const maxScale = 4;
const minScale = 0.5;
const zoomStep = 0.5;

imageToView.addEventListener('click', (event) => {
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(viewedImage, 'inline');
    viewedImage.src = imageToView.src;
    event.stopPropagation();
    currentScale = 1;
    viewedImage.style.transform = `scale(${currentScale}) translate(0, 0)`;
    currentX = 0;
    currentY = 0;
});

viewedImage.addEventListener('click', (event) => {
    event.stopPropagation();
});

viewedImage.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        currentScale = Math.min(maxScale, currentScale + zoomStep);
    } else {
        currentScale = Math.max(minScale, currentScale - zoomStep);
    }
    viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
});

viewedImage.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    startX = event.clientX - currentX;
    startY = event.clientY - currentY;
    event.preventDefault();
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        currentX = event.clientX - startX;
        currentY = event.clientY - startY;
        viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete') {
        currentX = 0;
        currentY = 0;
        currentScale = 1;
        viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
    }
});