export const generateId = () => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('th-TH', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);
};

export const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors
    }
  }
};
