
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Group API methods
export const groupApi = {
  // Create a new group
  createGroup: async (groupData: any) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },
  
  // Get all groups for current user
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  
  // Get a single group by ID
  getGroup: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
  
  // Join a group with invite code
  joinGroup: async (inviteCode: string) => {
    const response = await api.post('/groups/join', { inviteCode });
    return response.data;
  },
  
  // Update a group
  updateGroup: async (groupId: string, groupData: any) => {
    const response = await api.put(`/groups/${groupId}`, groupData);
    return response.data;
  },
  
  // Remove a member from a group
  removeMember: async (groupId: string, userId: string) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },
  
  // Get group balances
  getBalances: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}/balances`);
    return response.data;
  },
  
  // Get settlement plan for a group
  getSettlements: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}/settlements`);
    return response.data;
  },
};

// Expense API methods
export const expenseApi = {
  // Add a new expense
  addExpense: async (expenseData: any) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },
  
  // Get all expenses for a group
  getExpenses: async (groupId: string) => {
    const response = await api.get(`/expenses/group/${groupId}`);
    return response.data;
  },
  
  // Get a single expense by ID
  getExpense: async (expenseId: string) => {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data;
  },
  
  // Update an expense
  updateExpense: async (expenseId: string, expenseData: any) => {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
  },
  
  // Delete an expense
  deleteExpense: async (expenseId: string) => {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },
  
  // Export expenses for a group (returns a CSV)
  exportExpenses: async (groupId: string) => {
    window.open(`${API_URL}/expenses/group/${groupId}/export`, '_blank');
  },
};

// Currency API methods (using Exchange Rates API)
export const currencyApi = {
  // Get all available currencies
  getCurrencies: async () => {
    // This is a mock implementation since we don't want to use a real API key here
    // In a real implementation, you would use a currency API like Exchange Rates API
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    ];
  },
  
  // Get exchange rates for a base currency
  getExchangeRates: async (baseCurrency: string) => {
    // Mock implementation
    const mockRates: Record<string, number> = {
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
    
    // If the base currency is not USD, normalize all rates
    if (baseCurrency !== 'USD') {
      const baseRate = mockRates[baseCurrency];
      const normalizedRates: Record<string, number> = {};
      
      Object.entries(mockRates).forEach(([currency, rate]) => {
        normalizedRates[currency] = rate / baseRate;
      });
      
      return normalizedRates;
    }
    
    return mockRates;
  },
  
  // Convert an amount from one currency to another
  convertCurrency: async (amount: number, fromCurrency: string, toCurrency: string) => {
    // Mock implementation
    const rates = await currencyApi.getExchangeRates('USD');
    
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    
    // Convert to USD first, then to target currency
    return (amount / fromRate) * toRate;
  },
};

export default api;
