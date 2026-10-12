/**
 * Format a number in Indian currency format with ₹ symbol.
 * e.g., 125000 → ₹1,25,000
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Split into integer and decimal parts
  const parts = absAmount.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];
  
  // Indian numbering: last 3 digits, then groups of 2
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    intPart = formatted + ',' + last3;
  }
  
  const result = decPart === '00' ? intPart : `${intPart}.${decPart}`;
  return `₹${isNegative ? '-' : ''}${result}`;
}

/**
 * Format number without currency symbol for table display
 */
export function formatAmount(amount: number): string {
  if (isNaN(amount)) return '0';
  
  const absAmount = Math.abs(amount);
  const parts = absAmount.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];
  
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    intPart = formatted + ',' + last3;
  }
  
  return decPart === '00' ? intPart : `${intPart}.${decPart}`;
}
