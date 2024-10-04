const calculatorSectionOpen = document.getElementById('calculator-section-open');
const calculatorContainer = document.getElementById('calculator-container');
const creditBox = calculatorContainer.querySelector('#credit-box');
const leasingBox = calculatorContainer.querySelector('#leasing-box');
const resultBox = calculatorContainer.querySelector('result');

calculatorSectionOpen.addEventListener('click', () => {
    hideAllElementsInModalWindow(modalWindow);
    toggleElementVisibility(modalWindow, 'flex');
    toggleElementVisibility(calculatorContainer, 'block');
});

document.getElementById('toggle-leasing').addEventListener('click', () => {
    toggleElementVisibility(creditBox, 'none');
    toggleElementVisibility(resultBox, 'none');
    resultBox.innerHTML = '';
    toggleElementVisibility(leasingBox, 'block');
});

document.getElementById('toggle-credit').addEventListener('click', () => {
    toggleElementVisibility(leasingBox, 'none');
    toggleElementVisibility(resultBox, 'none');
    resultBox.innerHTML = '';
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
        showMessage('Будь ласка, введіть усі дані для розрахунку кредиту.', false);
        return;
    }

    if (paymentType === 'annuity') {
        const creditPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        toggleElementVisibility(resultBox, 'block');
        resultBox.textContent = `Щомісячний платіж (Аннуїтетний): ${creditPayment.toFixed(2)} грн`;
    } else if (paymentType === 'differentiated') {
        toggleElementVisibility(resultBox, 'block');
        resultBox.innerHTML = 'Диференційовані платежі:<br>';
        for (let month = 1; month <= term; month++) {
            const monthlyPrincipal = amount / term;
            const interestPayment = (amount - (monthlyPrincipal * (month - 1))) * rate;
            const totalMonthlyPayment = monthlyPrincipal + interestPayment;
            resultBox.innerHTML += `Місяць ${month}: ${totalMonthlyPayment.toFixed(2)} грн<br>`;
        }
    }
});

const leasingForm = leasingBox.querySelector('form');

leasingForm.addEventListener('submit', e => {
    e.preventDefault();

    const contractAmount = parseFloat(leasingForm.querySelector('#contractAmount').value);
    const interestRate = parseFloat(leasingForm.querySelector('#interestRate').value) / 100;
    const advancePercentage = parseFloat(leasingForm.querySelector('#advance').value) / 100;
    const leaseTerm = parseInt(leasingForm.querySelector('#leaseTerm').value);
    const insuranceMonthly = parseFloat(leasingForm.querySelector('#insurance').value);

    if (isNaN(contractAmount) || isNaN(interestRate) || isNaN(advancePercentage) ||
        isNaN(leaseTerm) || isNaN(insuranceMonthly)) {
        showMessage('Будь ласка, введіть усі дані для розрахунку лізингу.', false);
        return;
    }

    const advancePayment = contractAmount * advancePercentage;
    const remainingAmount = contractAmount - advancePayment;
    const interestAmount = remainingAmount * interestRate * (leaseTerm / 12);
    const totalLeaseAmount = remainingAmount + interestAmount + (remainingAmount + interestAmount) * 0.2;
    const monthlyPaymentWithoutInsurance = totalLeaseAmount / leaseTerm;
    const monthlyPayment = monthlyPaymentWithoutInsurance + insuranceMonthly;

    toggleElementVisibility(resultBox, 'block');
    resultBox.innerHTML = `Вартість договору лізингу: ${totalLeaseAmount.toFixed(2)}
    <br>Розмір авансу: ${advancePayment.toFixed(2)} 
    <br>Щомісячний платіж: ${monthlyPayment.toFixed(2)}`;
});