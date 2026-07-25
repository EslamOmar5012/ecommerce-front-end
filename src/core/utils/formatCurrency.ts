export const formatCurrency = (amount: number, currency = 'EGP'): string => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};
