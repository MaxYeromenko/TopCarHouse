const compareSectionOpen = document.getElementById('compare-section-open');
const compareSection = document.getElementById('compare-section');
const compareCloseButton = document.getElementById('compare-close-button');

compareSectionOpen.addEventListener('click', () => {
    compareSection.style.visibility = 'visible';
});

compareCloseButton.addEventListener('click', () => {
    compareSection.style.visibility = 'hidden';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        compareSection.style.visibility = 'hidden';
    }
});