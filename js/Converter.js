class Converter {
    constructor(apiService, dateUtils) {
        this.IOF = 4.38;
        this.apiService = apiService; 
        this.dateUtils = dateUtils; 
        this.exchangeRate = null; 
        this.exchangeRateDate = null;

        this.init();
    }

    init() {
        this.setupFormSubmitHandler(); // Configura o manipulador do evento de submissao do formulario
        this.addInputHandlers(); // Configura os eventos de entrada nos campos
    }

    setupFormSubmitHandler() {
        const converterForm = document.getElementById('converterForm');
        converterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.validateInputs()) {
                return;
            }
            await this.convertCurrency();
        });
    }

    addInputHandlers() {
        const usdInput = document.getElementById('usdAmount'); 
        const spreadInput = document.getElementById('bankSpread'); 
        const convertButton = document.querySelector('#converterForm button[type="submit"]'); 

        usdInput.addEventListener('input', () => {
            this.clearInputError(usdInput); 
            this.updateButtonState(convertButton); 
        });

        usdInput.addEventListener('blur', () => {
            this.formatInputValue(usdInput); 
        });

        spreadInput.addEventListener('input', () => {
            this.clearInputError(spreadInput); 
            this.updateButtonState(convertButton); 
        });

        spreadInput.addEventListener('blur', () => {
            this.formatInputValue(spreadInput);
        });
    }

    clearInputError(input) {
        input.classList.remove('is-invalid'); 
        const requiredMessage = input.nextElementSibling; 
        if (requiredMessage) {
            requiredMessage.style.display = 'none'; 
        }
    }

    formatInputValue(input) {
        const value = input.value.trim(); 
        if (value && !isNaN(value)) {
            input.value = parseFloat(value).toFixed(2);
        }
    }

    updateButtonState(button, isValid = null) {
        if (isValid === null) {
            const usdAmount = document.getElementById('usdAmount').value.trim();
            const bankSpread = document.getElementById('bankSpread').value.trim();
            isValid = usdAmount && !isNaN(parseFloat(usdAmount)) && bankSpread && !isNaN(parseFloat(bankSpread));
        }

        if (isValid) {
            button.classList.remove('btn-invalid');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-invalid');
        }
    }

    validateInputs() {
        const usdInput = document.getElementById('usdAmount');
        const spreadInput = document.getElementById('bankSpread');
        const convertButton = document.querySelector('#converterForm button[type="submit"]');
        let isValid = true;

        if (!usdInput.value.trim() || isNaN(parseFloat(usdInput.value))) {
            this.markInvalid(usdInput, "O valor em USD e obrigatorio");
            isValid = false;
        }

        if (!spreadInput.value.trim() || isNaN(parseFloat(spreadInput.value))) {
            this.markInvalid(spreadInput, "O spread bancario e obrigatorio");
            isValid = false;
        }

        this.updateButtonState(convertButton, isValid);
        return isValid;
    }

    markInvalid(input, message) {
        input.classList.add('is-invalid');
        let requiredMessage = input.nextElementSibling;

        if (!requiredMessage || !requiredMessage.classList.contains('required-message')) {
            requiredMessage = document.createElement('span');
            requiredMessage.classList.add('required-message');
            requiredMessage.textContent = message;
            input.parentNode.appendChild(requiredMessage);
        }

        requiredMessage.style.display = 'inline'; // Exibe a mensagem
    }

    async convertCurrency() {
        const usdAmount = parseFloat(document.getElementById('usdAmount').value.trim());
        const bankSpread = parseFloat(document.getElementById('bankSpread').value.trim());

        if (!this.exchangeRate) {
            this.exchangeRate = await this.fetchValidExchangeRate();
        }

        if (!this.exchangeRate) {
            alert("Nao foi possivel obter a taxa de cambio. Tente novamente mais tarde.");
            return;
        }

        const spreadAmount = usdAmount * (bankSpread / 100);
        const totalWithSpread = usdAmount + spreadAmount;
        const iofAmount = totalWithSpread * (this.IOF / 100);
        const finalValue = totalWithSpread * this.exchangeRate + iofAmount * this.exchangeRate;

        this.displayResult(iofAmount * this.exchangeRate, spreadAmount * this.exchangeRate, finalValue);
    }

    displayResult(iofAmount, spreadAmount, finalValue) {
        const resultDiv = document.getElementById('result');
        const formattedExchangeRateDate = this.dateUtils.formatDateToBrazilian(this.exchangeRateDate);

        resultDiv.innerHTML = `
            <p>Data da Taxa de Cambio: <strong>${formattedExchangeRateDate}</strong></p>
            <p>IOF em BRL: <strong>${iofAmount.toFixed(2)}</strong></p>
            <p>Spread Bancario em BRL: <strong>${spreadAmount.toFixed(2)}</strong></p>
            <p>Valor Final em BRL: <strong>${finalValue.toFixed(2)}</strong></p>
        `;
    }

    async fetchValidExchangeRate() {
        let date = new Date(); 
        let formattedDate = this.dateUtils.formatDateToMMDDYYYY(date);

        while (true) {
            const rate = await this.apiService.fetchCurrentExchangeRate(formattedDate);

            if (rate !== null) {
                this.exchangeRateDate = date;
                return rate;
            }
            
            date.setDate(date.getDate() - 1);
            formattedDate = this.dateUtils.formatDateToMMDDYYYY(date);
        }
    }
}
