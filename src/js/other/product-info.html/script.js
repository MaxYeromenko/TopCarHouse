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
viewedImage.alt = "Збільшене зображення авто";
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
        viewedImage.style.cursor = 'zoom-in';
    } else {
        currentScale = Math.max(minScale, currentScale - zoomStep);
        viewedImage.style.cursor = 'zoom-out';
    }
    viewedImage.style.cursor = '';
    viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
});

viewedImage.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    viewedImage.style.cursor = 'grabbing';
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
    viewedImage.style.cursor = '';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete') {
        currentX = 0;
        currentY = 0;
        currentScale = 1;
        viewedImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
    }
});

const params = new URLSearchParams(window.location.search);
const carId = params.get('id');
let productData;

document.addEventListener("DOMContentLoaded", async () => {
    showMessage('Завантаження...', true);

    try {
        const result = await fetchWithRetry(`/api/api-cars-control?id=${carId}`, retriesLimit);

        if (result) {
            productData = result[0];
            loadProductInfo();
            showMessage('Дані успішно завантажені!', true);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
    }
});

function loadProductInfo() {
    document.title = `${productData.brand} ${productData.model} | TopCarHouse`;

    document.getElementById('product-name-year').textContent = `${productData.brand} ${productData.model} — ${productData.year}`;
    document.getElementById('product-price').textContent = `$${productData.price}`;

    let productImages = productData.images && productData.images.length > 0
        ? productData.images.map(image => image.startsWith('http') ? image : `${cloudinaryURL}${image}`)
        : [default_car_URL];

    const productImage = document.getElementById('product-image');
    productImage.loading = "lazy";

    Promise.all(productImages.map(imageUrl =>
        checkImageValidity(imageUrl).catch(() => default_car_URL)
    )).then(validImages => {
        if (validImages.length > 0) {
            productImage.src = validImages[0];
            document.getElementById('page-tracker').textContent = `1 / ${validImages.length}`;
        } else {
            productImage.src = default_car_URL;
            showMessage('Изображения недоступны', false);
        }

        let currentImageIndex = 0;

        const updateImage = () => {
            productImage.src = validImages[currentImageIndex];
            document.getElementById('page-tracker').textContent = `${currentImageIndex + 1} / ${validImages.length}`;
        };

        document.getElementById('slider-next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % validImages.length;
            updateImage();
        });

        document.getElementById('slider-prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + validImages.length) % validImages.length;
            updateImage();
        });
    });

    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('product-brand').textContent = productData.brand;
    document.getElementById('product-model').textContent = productData.model;
    document.getElementById('product-year').textContent = productData.year;
    document.getElementById('product-color').textContent = productData.color;
    document.getElementById('product-country').textContent = productData.country;
    document.getElementById('product-transmission').textContent = productData.features.transmission;
    document.getElementById('product-engine').textContent = productData.features.engine > 0 ? `${productData.features.engine} л` : '-';
    document.getElementById('product-horsepower').textContent = `${productData.features.horsepower} к. с.`;
    document.getElementById('product-fuel-consumption').textContent =
        productData.features.fuel_consumption > 0 ? `${productData.features.fuel_consumption} л / 100 км` : '-';
    document.getElementById('product-fuel-type').textContent = productData.features.fuel_type;
    document.getElementById('product-body-type').textContent = productData.features.body_type;
}

document.getElementById('add-to-compare-button').addEventListener('click', () => {
    addToCarToLocalStorage(carId);
});