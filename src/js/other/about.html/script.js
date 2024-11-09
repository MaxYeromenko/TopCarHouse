import {
    createConsultationRequest,
    themeApplication, showServicesModalWindow
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();

const carMarkUp =
    `<img id="car" src="/src/images/icons/topcarhouse-favicon-black.png" alt="Автомобіль">
    <div id="thank-you-message-bg">
        <div id="thank-you-message">
            <img src="https://res.cloudinary.com/dukwtlvte/image/upload/v1725910176/logo-no-background_kuzaip.png"
                alt="Логотип">
            <h3>Щиро дякуємо за підтримку!</h3>
        </div>
    </div>`;

document.querySelector('main').insertAdjacentHTML('beforeend', carMarkUp);

const car_icon = document.getElementById('car');

car_icon.addEventListener("click", () => {
    const thank_message_bg = document.getElementById('thank-you-message-bg');
    const thank_message = document.getElementById('thank-you-message')

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const carWidth = car_icon.offsetWidth;
    const carHeight = car_icon.offsetHeight;

    const carPositionX = (windowWidth - carWidth) / 2;
    const carPositionY = (windowHeight - carHeight) / 2;

    const initialPosition = car_icon.getBoundingClientRect().left;
    car_icon.style.transition = 'transform 3s';
    car_icon.style.transform = `translate(${initialPosition}px, -100%)`;

    let newPosition = car_icon.getBoundingClientRect().left;

    setTimeout(() => {
        newPosition = car_icon.getBoundingClientRect().left;
        car_icon.style.transition = 'all 1s';
        car_icon.style.transform = `translate(${newPosition + initialPosition}px, -100%) scaleX(-1)`;
    }, 3000);

    setTimeout(() => {
        newPosition = car_icon.getBoundingClientRect().left;
        car_icon.style.transform = `translate(${carPositionX - newPosition}px, ${-carPositionY}px) scaleX(-1)`;
    }, 4000);

    setTimeout(() => {
        thank_message_bg.style.transition = 'all 1s';
        thank_message.style.transition = 'opacity 1s';
        thank_message_bg.style.visibility = 'visible';
        thank_message.style.opacity = '1';
        car_icon.style.opacity = '0';
    }, 4500);

    setTimeout(() => {
        thank_message_bg.style.opacity = '0';
        thank_message_bg.style.visibility = 'hidden';
    }, 6500);
});