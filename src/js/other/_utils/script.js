export function createConsultationRequest() {
    const consultationContainer = document.getElementById('consultation-container');
    const consultationForm = consultationContainer.querySelector('form');
    const nameRegex = /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ\s]{3,}$/;
    const phoneRegex = /^\+380\d{9}$/;

    document.getElementById('consultation-button').addEventListener('click', () => {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(consultationContainer, 'block');
    });

    document.getElementById('consultation-phone').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9+]/g, '');
        if (this.value.indexOf('+') > 0) {
            this.value = this.value.replace(/\+/g, '');
        }

        if (this.value.indexOf('+') === 0 && this.value.slice(1).includes('+')) {
            this.value = '+' + this.value.slice(1).replace(/\+/g, '');
        }
    });

    consultationForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('consultation-name').value.trim();
        const phone = document.getElementById('consultation-phone').value;
        const dateInput = document.getElementById('consultation-date').value;
        const timeInput = document.getElementById('consultation-time').value;
        const selectedDateTime = new Date(`${dateInput}T${timeInput}`);
        const currentDateTime = new Date();

        if (!nameRegex.test(name)) {
            showMessage('Введіть правильне ім’я (тільки букви, мінімум 3 символи)!', false);
            return;
        }

        if (!phoneRegex.test(phone)) {
            showMessage('Введіть правильний номер телефону у форматі +380123456789!', false);
            return;
        }

        if (isNaN(selectedDateTime.getTime())) {
            showMessage('Виберіть коректну дату і час!', false);
            return;
        }

        if (selectedDateTime <= currentDateTime) {
            showMessage('Виберіть дату і час у майбутньому!', false);
            return;
        }

        showMessage('Завантаження...', true);

        try {
            const result = await fetchWithRetryPost(`/api/post-consultation-request`,
                {
                    name, phone, datetime: selectedDateTime.toISOString()
                }, retriesLimit);

            if (result.success) {
                showMessage(result.message, result.success);
                consultationForm.reset();
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
        }
    });
};

export function themeApplication() {
    const themeSectionOpen = document.getElementById('theme-section-open');
    const themeContainer = document.getElementById('theme-container');
    const themeContainerButtons = themeContainer.querySelectorAll('button');

    themeSectionOpen.addEventListener('click', () => {
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
};

export function showServicesModalWindow() {
    const servicesButtons = document.querySelectorAll('.services-button');
    const servicesContainer = document.getElementById('services-container');

    servicesButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleElementVisibility(modalWindow, 'flex');
            toggleElementVisibility(servicesContainer, 'flex');
        });
    });
};

export function calculatorIntegration() {
    const calculatorSectionOpen = document.getElementById('calculator-section-open');
    const calculatorContainer = document.getElementById('calculator-container');
    const creditBox = calculatorContainer.querySelector('#credit-box');
    const leasingBox = calculatorContainer.querySelector('#leasing-box');
    const resultBox = calculatorContainer.querySelector('result');

    calculatorSectionOpen.addEventListener('click', () => {
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

        if (isNaN(amount) || isNaN(term) || isNaN(rate) || amount === 0 || term === 0 || rate === 0) {
            showMessage('Будь ласка, введіть усі дані для розрахунку кредиту.', false);
            return;
        }

        if (paymentType === 'annuity') {
            const creditPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
            if (!isFinite(creditPayment)) {
                showMessage('Введені значення призводять до некоректного результату. Будь ласка, перевірте дані.', false);
                return;
            }
            toggleElementVisibility(resultBox, 'block');
            resultBox.textContent = `Щомісячний платіж (Аннуїтетний): ${creditPayment.toFixed(2)} грн`;
        } else if (paymentType === 'differentiated') {
            toggleElementVisibility(resultBox, 'block');
            resultBox.innerHTML = 'Диференційовані платежі:<br>';
            for (let month = 1; month <= term; month++) {
                const monthlyPrincipal = amount / term;
                const interestPayment = (amount - (monthlyPrincipal * (month - 1))) * rate;
                const totalMonthlyPayment = monthlyPrincipal + interestPayment;
                if (!isFinite(totalMonthlyPayment)) {
                    showMessage('Некорректний результат. Перевірте введені дані.', false);
                    resultBox.innerHTML = '';
                    return;
                }
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
            isNaN(leaseTerm) || isNaN(insuranceMonthly) || contractAmount === 0 || leaseTerm === 0) {
            showMessage('Будь ласка, введіть усі дані для розрахунку лізингу.', false);
            return;
        }

        const advancePayment = contractAmount * advancePercentage;
        const remainingAmount = contractAmount - advancePayment;
        const interestAmount = remainingAmount * interestRate * (leaseTerm / 12);
        const totalLeaseAmount = remainingAmount + interestAmount + (remainingAmount + interestAmount) * 0.2;
        const monthlyPaymentWithoutInsurance = totalLeaseAmount / leaseTerm;
        const monthlyPayment = monthlyPaymentWithoutInsurance + insuranceMonthly;

        if (!isFinite(totalLeaseAmount) || !isFinite(monthlyPayment)) {
            showMessage('Некорректний результат. Перевірте введені дані.', false);
            return;
        }

        toggleElementVisibility(resultBox, 'block');
        resultBox.innerHTML = `Вартість договору лізингу: ${totalLeaseAmount.toFixed(2)}
        <br>Розмір авансу: ${advancePayment.toFixed(2)} 
        <br>Щомісячний платіж: ${monthlyPayment.toFixed(2)}`;
    });
};

export function compareCarsIntegration() {
    const compareSectionOpen = document.getElementById('compare-section-open');
    const compareContainer = document.getElementById('compare-container');

    compareSectionOpen.addEventListener('click', () => {
        toggleElementVisibility(modalWindow, 'flex');
        toggleElementVisibility(compareContainer, 'grid');
        updateCarsToCompare(compareContainer);
    });

    let isLoading = false;

    async function updateCarsToCompare(compareContainer) {
        if (isLoading) return;
        isLoading = true;

        compareContainer.innerHTML = '';
        const carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];

        if (carsToCompare.length > 0) {
            showMessage('Завантаження...', true);

            const validCars = [];

            for (const carId of carsToCompare) {
                try {
                    const result = await fetchWithRetry(`/api/api-cars-control?id=${carId}`, retriesLimit);

                    if (result) {
                        const carCard = createCompareCarCard(result[0]);
                        compareContainer.appendChild(carCard);
                        validCars.push(carId);
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                    showMessage('Помилка сервера, будь ласка, відправте дані ще раз або перезавантажте сторінку!', false);
                }
            }

            if (validCars.length !== carsToCompare.length) {
                localStorage.setItem('carsToCompare', JSON.stringify(validCars));
            }

            showMessage('Дані успішно завантажені!', true);
        } else {
            const nothingToCompareMessage = document.createElement('span');
            nothingToCompareMessage.className = 'nothing-to-compare-message';
            nothingToCompareMessage.textContent = 'Відсутні авто для порівняння!';
            compareContainer.appendChild(nothingToCompareMessage);
        }
        isLoading = false;
    }

    function createCompareCarCard(car) {
        const carCardToCompare = document.createElement('div');
        carCardToCompare.classList.add('carToCompare');

        carCardToCompare.innerHTML = `
            <div class="compare-item">
                <button><i class="fa-solid fa-trash-can"></i></button>
                <h2 id="compare-product-title">${car.brand} ${car.model}</h2>
                <div class="compare-product-info">
                    <div>Рік: <span>${car.year}</span></div>
                    <div>Потужність: <span>${car.features.horsepower} к.с.</span></div>
                    <div>Ціна: <span>$${car.price}</span></div>
                    <div>Колір: <span>${car.color}</span></div>
                    <div>Країна: <span>${car.country}</span></div>
                    <div>Коробка передач: <span>${car.features.transmission}</span></div>
                    <div>Двигун: <span>${isNaN(car.features.engine) ? car.features.engine : `${car.features.engine} л`}</span></div>
                    <div>Споживання палива: <span>${car.features.fuel_consumption} л / 100 км</span></div>
                    <div>Тип палива: <span>${car.features.fuel_type}</span></div>
                    <div>Тип кузова: <span>${car.features.body_type}</span></div>
                </div>
            </div>`;

        carCardToCompare.querySelector('button').addEventListener('click', () => {
            removeCarFromCompare(car._id);
        });

        return carCardToCompare;
    }

    function removeCarFromCompare(carId) {
        const carsToCompare = JSON.parse(localStorage.getItem('carsToCompare')) || [];
        const updatedCarsToCompare = carsToCompare.filter(id => id !== carId);

        localStorage.setItem('carsToCompare', JSON.stringify(updatedCarsToCompare));
        updateCarsToCompare(compareContainer);
    }
};