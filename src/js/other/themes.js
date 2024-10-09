const themeSectionOpen = document.getElementById('theme-section-open');
const themeContainer = document.getElementById('theme-container');
const themeContainerButtons = themeContainer.querySelectorAll('button');

themeSectionOpen.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(themeContainer, 'block');
});

themeContainerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.parentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selected-theme', theme);
    })
});