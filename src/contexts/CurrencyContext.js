import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Common currencies with their symbols
const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  MXN: { symbol: 'MX$', name: 'Mexican Peso' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Load from localStorage or default to USD
    const saved = localStorage.getItem('selectedCurrency');
    return saved && CURRENCIES[saved] ? saved : 'USD';
  });

  useEffect(() => {
    // Save to localStorage whenever currency changes
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  const formatCurrency = (amount) => {
    const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD;
    const formattedAmount = parseFloat(amount || 0).toFixed(2);
    
    // For currencies that typically put symbol after (like some European currencies)
    if (currency === 'EUR' || currency === 'CHF') {
      return `${formattedAmount} ${currencyInfo.symbol}`;
    }
    
    // For most currencies, symbol comes before
    return `${currencyInfo.symbol}${formattedAmount}`;
  };

  const getCurrencySymbol = () => {
    return CURRENCIES[currency]?.symbol || '$';
  };

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol,
    currencies: CURRENCIES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

