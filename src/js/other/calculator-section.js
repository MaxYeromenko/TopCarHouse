const calculatorSectionOpen = document.getElementById('calculator-section-open');
const calculatorContainer = document.getElementById('calculator-container');
const creditBox = document.getElementById('credit-box');
const leasingBox = document.getElementById('leasing-box');

calculatorSectionOpen.addEventListener('click', () => {
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(calculatorContainer, 'block');
});

document.getElementById('toggle-leasing').addEventListener('click', () => {
    toggleElementVisibility(creditBox, 'none');
    toggleElementVisibility(leasingBox, 'block');
});

document.getElementById('toggle-credit').addEventListener('click', () => {
    toggleElementVisibility(leasingBox, 'none');
    toggleElementVisibility(creditBox, 'block');
});

const creditForm = creditBox.querySelector('form');

creditForm.addEventListener('submit', e => {
    e.preventDefault();

    const amount = Math.abs(parseFloat(creditForm.querySelector('#creditAmount').value));
    const term = Math.abs(parseInt(creditForm.querySelector('#creditTerm').value));
    const rate = Math.abs(parseFloat(creditForm.querySelector('#creditRate').value) / 100 / 12);
    const paymentType = creditForm.querySelector('#paymentType').value;

    if (isNaN(amount) || isNaN(term) || isNaN(rate)) {
        alert('Будь ласка, введіть усі дані для розрахунку кредиту.');
        return;
    }

    if (paymentType === 'annuity') {
        const creditPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        alert(`Щомісячний платіж (Аннуїтетний): ${creditPayment.toFixed(2)} грн`);
    } else if (paymentType === 'differentiated') {
        let result = '';
        for (let month = 1; month <= term; month++) {
            const monthlyPrincipal = amount / term;
            const interestPayment = (amount - (monthlyPrincipal * (month - 1))) * rate;
            const totalMonthlyPayment = monthlyPrincipal + interestPayment;
            result += `Місяць ${month}: ${totalMonthlyPayment.toFixed(2)} грн\n`;
        }
        alert(`Диференційовані платежі:\n${result}`);
    }
});
