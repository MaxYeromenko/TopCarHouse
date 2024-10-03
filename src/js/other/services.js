const servicesButtons = document.querySelectorAll('.services-button');
const servicesContainer = document.getElementById('services-container');

servicesButtons.forEach(button => {
    button.addEventListener('click', () => {
        hideAllElementsInModalWindow(modalWindow);
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(servicesContainer, 'flex');
    });
});