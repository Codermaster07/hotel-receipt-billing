/**
 * Convert a number to Indian currency words.
 * e.g., 5250 → "Rupees Five Thousand Two Hundred Fifty Only"
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function twoDigitWords(n: number): string {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tens[t] + (o ? ' ' + ones[o] : '');
}

function threeDigitWords(n: number): string {
  if (n === 0) return '';
  const h = Math.floor(n / 100);
  const r = n % 100;
  let result = '';
  if (h > 0) {
    result += ones[h] + ' Hundred';
    if (r > 0) result += ' ';
  }
  if (r > 0) {
    result += twoDigitWords(r);
  }
  return result;
}

export function numberToIndianWords(amount: number): string {
  if (amount === 0) return 'Rupees Zero Only';
  if (isNaN(amount)) return '';

  const absAmount = Math.abs(Math.floor(amount));
  
  if (absAmount === 0) return 'Rupees Zero Only';

  const crore = Math.floor(absAmount / 10000000);
  const lakh = Math.floor((absAmount % 10000000) / 100000);
  const thousand = Math.floor((absAmount % 100000) / 1000);
  const hundred = absAmount % 1000;

  let words = '';

  if (crore > 0) {
    words += twoDigitWords(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += twoDigitWords(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += twoDigitWords(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    words += threeDigitWords(hundred);
  }

  // Handle paise
  const paise = Math.round((Math.abs(amount) - absAmount) * 100);
  
  let result = 'Rupees ' + words.trim();
  
  if (paise > 0) {
    result += ' and ' + twoDigitWords(paise) + ' Paise';
  }
  
  result += ' Only';

  return result;
}
