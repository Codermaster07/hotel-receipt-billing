import type { BillingItem, TaxConfig, DiscountConfig, BillCalculations } from '../types/bill';

export function calculateItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calculateSubtotal(items: BillingItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateDiscountAmount(
  subtotal: number,
  discount: DiscountConfig
): number {
  if (!discount.enabled || discount.value <= 0) return 0;
  if (discount.type === 'percentage') {
    return Math.round((subtotal * discount.value) / 100 * 100) / 100;
  }
  return Math.min(discount.value, subtotal);
}

export function calculateTaxAmount(
  taxableAmount: number,
  tax: TaxConfig
): number {
  if (!tax.enabled || tax.taxPercentage <= 0) return 0;
  return Math.round((taxableAmount * tax.taxPercentage) / 100 * 100) / 100;
}

export function calculateGrandTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number
): number {
  return Math.round((subtotal - discountAmount + taxAmount) * 100) / 100;
}

export function calculateBalance(grandTotal: number, amountPaid: number): number {
  return Math.round((grandTotal - amountPaid) * 100) / 100;
}

export function calculateAll(
  items: BillingItem[],
  tax: TaxConfig,
  discount: DiscountConfig,
  amountPaid: number
): BillCalculations {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = calculateTaxAmount(taxableAmount, tax);
  const grandTotal = calculateGrandTotal(subtotal, discountAmount, taxAmount);
  const balanceAmount = calculateBalance(grandTotal, amountPaid);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    grandTotal,
    balanceAmount,
  };
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}
