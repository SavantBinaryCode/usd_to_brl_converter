class Converter {
  constructor() {
      this.IOF = 4.38;
      this.exchangeRate = null;
      this.exchangeRateDate = null; // To store the date of the fetched exchange rate
      this.init();
  }

  init() {
      document.getElementById('converterForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          if (!this.validateInputs()) {
              return;
          }
          await this.convertCurrency();
      });

      this.addInputHandlers();
  }

  addInputHandlers() {
      const usdInput = document.getElementById('usdAmount');
      const spreadInput = document.getElementById('bankSpread');
      const convertButton = document.querySelector('#converterForm button[type="submit"]');

      [usdInput, spreadInput].forEach(input => {
          input.addEventListener('input', () => {
              input.classList.remove('is-invalid'); // Remove red highlight
              const requiredMessage = input.nextElementSibling; // Find the message span
              if (requiredMessage) {
                  requiredMessage.style.display = 'none'; // Hide the message
              }

              // Update button state
              this.updateButtonState(convertButton);
          });

          input.addEventListener('blur', () => {
              const value = input.value.trim();

              if (value && !isNaN(value)) {
                  input.value = parseFloat(value).toFixed(2);
              }
          });
      });
  }

  validateInputs() {
      const usdInput = document.getElementById('usdAmount');
      const spreadInput = document.getElementById('bankSpread');
      const convertButton = document.querySelector('#converterForm button[type="submit"]');
      let isValid = true;

      if (!usdInput.value.trim() || isNaN(parseFloat(usdInput.value))) {
          this.markInvalid(usdInput, "USD Amount is required");
          isValid = false;
      }

      if (!spreadInput.value.trim() || isNaN(parseFloat(spreadInput.value))) {
          this.markInvalid(spreadInput, "Bank Spread is required");
          isValid = false;
      }

      this.updateButtonState(convertButton, isValid);
      return isValid;
  }

  markInvalid(input, message) {
      input.classList.add('is-invalid'); // Add red highlight
      let requiredMessage = input.nextElementSibling;

      // If no message span exists, create one
      if (!requiredMessage || !requiredMessage.classList.contains('required-message')) {
          requiredMessage = document.createElement('span');
          requiredMessage.classList.add('required-message');
          requiredMessage.textContent = message;
          input.parentNode.appendChild(requiredMessage);
      }

      requiredMessage.style.display = 'inline'; // Show the message
  }

  updateButtonState(button, isValid = null) {
      // Check if both inputs are valid if isValid is not passed
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

  async convertCurrency() {
      const usdAmount = parseFloat(document.getElementById('usdAmount').value.trim());
      const bankSpread = parseFloat(document.getElementById('bankSpread').value.trim());

      if (!this.exchangeRate) {
          this.exchangeRate = await this.fetchValidExchangeRate();
      }

      if (!this.exchangeRate) {
          alert("Unable to retrieve exchange rate data. Please try again later.");
          return;
      }

      const spreadAmount = usdAmount * (bankSpread / 100);
      const totalWithSpread = usdAmount + spreadAmount;
      const iofAmount = totalWithSpread * (this.IOF / 100);
      const finalValue = totalWithSpread * this.exchangeRate + iofAmount * this.exchangeRate;

      this.displayResult(iofAmount * this.exchangeRate, spreadAmount * this.exchangeRate, finalValue);
  }

  async fetchValidExchangeRate() {
      let date = new Date();
      let formattedDate = DateUtils.formatDateToMMDDYYYY(date);

      while (true) {
          const rate = await ApiService.fetchCurrentExchangeRate(formattedDate);

          if (rate !== null) {
              this.exchangeRateDate = date; // Store the date object instead of formatted string
              return rate;
          }

          date.setDate(date.getDate() - 1);
          formattedDate = DateUtils.formatDateToMMDDYYYY(date);
      }
  }

  displayResult(iofAmount, spreadAmount, finalValue) {
      const resultDiv = document.getElementById('result');
      const formattedExchangeRateDate = DateUtils.formatDateToBrazilian(this.exchangeRateDate); // Format date to DD/MM/YYYY
      resultDiv.innerHTML = `
          <p>Exchange Rate Date: <strong>${formattedExchangeRateDate}</strong></p>
          <p>IOF Tax in BRL: <strong>${iofAmount.toFixed(2)}</strong></p>
          <p>Bank Spread Tax in BRL: <strong>${spreadAmount.toFixed(2)}</strong></p>
          <p>Final Convert Value in BRL: <strong>${finalValue.toFixed(2)}</strong></p>
      `;
  }
}
