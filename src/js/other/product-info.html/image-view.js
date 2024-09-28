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
    event.stopPropagation();
    currentScale = 1;
    currentX = 0;
    currentY = 0;

    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(viewedImage, 'flex');
    viewedImage.src = imageToView.src;
    viewedImage.style.transform = `scale(${currentScale}) translate(0px, 0px)`;
});

viewedImage.addEventListener('click', (event) => {
    event.stopPropagation();
});

viewedImage.addEventListener('wheel', (event) => {
    event.preventDefault();
    const prevScale = currentScale;

    if (event.deltaY < 0) {
        currentScale = Math.min(maxScale, currentScale + zoomStep);
    } else {
        currentScale = Math.max(minScale, currentScale - zoomStep);
    }

    currentX = (currentX / prevScale) * currentScale;
    currentY = (currentY / prevScale) * currentScale;

    viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
});

viewedImage.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    isDragging = true;

    const rect = viewedImage.getBoundingClientRect();
    startX = event.clientX - rect.left - currentX;
    startY = event.clientY - rect.top - currentY;

    event.preventDefault();
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        currentX = event.clientX - startX;
        currentY = event.clientY - startY;

        const maxX = (viewedImage.clientWidth * currentScale - modalWindow.clientWidth) / 2;
        const maxY = (viewedImage.clientHeight * currentScale - modalWindow.clientHeight) / 2;

        currentX = Math.max(-maxX, Math.min(currentX, maxX));
        currentY = Math.max(-maxY, Math.min(currentY, maxY));

        viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

viewedImage.addEventListener('mouseup', () => {
    isDragging = false;
});
