
/**
 * Currency converter utility
 */

// Exchange rates (in a real app this would come from an API)
const exchangeRates = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 150.14,
  CAD: 1.37,
  AUD: 1.53,
  INR: 83.11,
  CNY: 7.23,
  BRL: 5.05,
  RUB: 93.21,
};

// Last update timestamp
let lastUpdated = Date.now();

/**
 * Convert an amount from one currency to another
 * 
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code
 * @param {string} toCurrency - The target currency code
 * @returns {number} - The converted amount
 */
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || fromCurrency === toCurrency) {
    return amount;
  }

  // Check if rates exist for both currencies
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    console.warn(`Currency rate not found for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  // Convert to USD first (as base currency)
  let amountInUsd = amount;
  if (fromCurrency !== 'USD') {
    amountInUsd = amount / exchangeRates[fromCurrency];
  }

  // Then convert from USD to target currency
  if (toCurrency === 'USD') {
    return amountInUsd;
  }

  return amountInUsd * exchangeRates[toCurrency];
};

/**
 * Get all available exchange rates
 * 
 * @returns {Object} - Exchange rates dictionary
 */
const getExchangeRates = () => {
  // Check if rates should be updated (in a real app this would happen more frequently)
  const now = Date.now();
  if (now - lastUpdated > 3600000) { // 1 hour
    updateExchangeRates();
  }
  return exchangeRates;
};

/**
 * Format a date to ISO format (YYYY-MM-DD)
 * 
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Update exchange rates (in a real app, this would fetch from API)
 * 
 * @returns {Object} - Updated exchange rates
 */
const updateExchangeRates = async () => {
  // In a real app, this would make an API call to get updated rates
  // Add some minor fluctuations to simulate real exchange rate changes
  Object.keys(exchangeRates).forEach(currency => {
    if (currency !== 'USD') {
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% change
      exchangeRates[currency] = exchangeRates[currency] * (1 + fluctuation);
    }
  });
  
  lastUpdated = Date.now();
  return exchangeRates;
};

module.exports = {
  convertCurrency,
  getExchangeRates,
  updateExchangeRates,
  formatDate
};
