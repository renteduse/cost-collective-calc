
/**
 * Currency converter utility
 */

// Mock exchange rates (in a real app this would come from an API)
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
  return exchangeRates;
};

/**
 * Update exchange rates (in a real app, this would fetch from API)
 * 
 * @returns {Object} - Updated exchange rates
 */
const updateExchangeRates = async () => {
  // In a real app, this would make an API call to get updated rates
  // For now, we just return the static rates
  return exchangeRates;
};

module.exports = {
  convertCurrency,
  getExchangeRates,
  updateExchangeRates
};
