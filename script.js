const currencyList = document.getElementById("currency-select");
const foreignCurrency = document.getElementById("foreign-currency");
const PLNcurrency = document.getElementById("PLN-currency");
const exchangeInfo = document.getElementById("converted-result");

// Fetch list of available currencies
function fetchCurrencies() {
    return fetch('https://api.nbp.pl/api/exchangerates/tables/a/')
    .then(response => response.json())
    .then(data => {
        if (!data || !data.rates || data.rates.length === 0){
            console.error("There was an error while fetching data.");
        }

        const currencies = data[0].rates.map(rate => rate.code); // Get currency code and name

        return currencies;
    })
    .catch(error => console.error(error));
}

// Fetch exchange rate for selectedCurrency
function getExchangeRate(selectedCurrency) {
    return fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${selectedCurrency}/?format=json&callback=callback`)
    .then(response => response.json())
    .then(data => {
        if (!data || !data.rates || data.rates.length === 0){
            console.error("There was an error while fetching data.");
        }
        const exchangeRate = data.rates[0].mid;
        return exchangeRate;
    });
}

// Get exchange rate listener
function convertCurrency(event, reversed = false){
    const selectedCurrency = currencyList.value;
    const sum = foreignCurrency.value;
    const PLNsum = PLNcurrency.value;
        getExchangeRate(selectedCurrency)
        .then(exchangeRate => {
            if (reversed){
                foreignCurrency.value = (PLNsum / exchangeRate).toFixed(2);
            } else {
                PLNcurrency.value = (sum * exchangeRate).toFixed(2);
            }
            
            let result = "1 " + selectedCurrency + " = " + exchangeRate.toString().bold() + " PLN".bold()
            exchangeInfo.innerHTML = result;
        })
        .catch(error => console.error(error));
}


fetchCurrencies()
    .then(currencies => {
        currencies.forEach(currency => {
            const optionElement = document.createElement('option');
            optionElement.text = currency;
            if (currency === "USD"){
                optionElement.selected = true;
            }
            currencyList.appendChild(optionElement);
        })

    // Initial conversion
    convertCurrency();

    // After change of foreign currency
    currencyList.addEventListener('change', convertCurrency);
    // After input in foreign currency
    foreignCurrency.addEventListener('input', convertCurrency);
    // After input in PLN
    PLNcurrency.addEventListener('input', () => { 
        convertCurrency(event, true);
      });
    })
      
    .catch(error => console.error(error));


