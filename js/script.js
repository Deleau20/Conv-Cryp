const express = require('express');
const axios = require('axios');

const app = express();
const API_KEY = "66c09d2faf31717cabfeed4411c963afc7f3e96af9a1003694a1d09b92445a40";

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('converter');
});

app.post('/', (req, res) => {
  const cryptoCurrency = req.body.crypto_currency;
  const targetCurrency = req.body.target_currency;
  const amount = parseFloat(req.body.amount);

  getExchangeRate(cryptoCurrency, targetCurrency)
    .then(exchangeRate => {
      const convertedAmount = convertCurrency(amount, exchangeRate);
      res.render('converter', {
        convertedAmount: convertedAmount,
        amount: amount,
        cryptoCurrency: cryptoCurrency,
        targetCurrency: targetCurrency
      });
    })
    .catch(() => {
      const errorMessage = "Invalid currency selected. Please try again.";
      res.render('converter', { error_message: errorMessage });
    });
});

function getExchangeRate(cryptoCurrency, targetCurrency) {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${cryptoCurrency}&tsyms=${targetCurrency}&api_key=${API_KEY}`;
  return axios.get(url)
    .then(response => {
      const data = response.data;
      const exchangeRate = data[targetCurrency];
      return exchangeRate;
    });
}

function convertCurrency(amount, exchangeRate) {
  const convertedAmount = amount * exchangeRate;
  return convertedAmount;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
