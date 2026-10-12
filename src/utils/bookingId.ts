const BOOKING_COUNTER_KEY = 'codecrax_booking_counter';
const BOOKING_PREFIX = 'CSS';

export function getNextBookingId(): string {
  const lastNumber = parseInt(localStorage.getItem(BOOKING_COUNTER_KEY) || '0', 10);
  const nextNumber = lastNumber + 1;
  localStorage.setItem(BOOKING_COUNTER_KEY, nextNumber.toString());
  return `${BOOKING_PREFIX}${String(nextNumber).padStart(2, '0')}`;
}

export function getCurrentBookingNumber(): number {
  return parseInt(localStorage.getItem(BOOKING_COUNTER_KEY) || '0', 10);
}

export function peekNextBookingId(): string {
  const lastNumber = parseInt(localStorage.getItem(BOOKING_COUNTER_KEY) || '0', 10);
  return `${BOOKING_PREFIX}${String(lastNumber + 1).padStart(2, '0')}`;
}

export function isBookingIdUsed(bookingId: string, savedBills: Array<{ bookingId: string }>): boolean {
  return savedBills.some((bill) => bill.bookingId === bookingId);
}
