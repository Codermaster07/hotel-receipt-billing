import type { SavedBill, BillData } from '../types/bill';

const SAVED_BILLS_KEY = 'codecrax_saved_bills';

export function saveBill(bill: BillData): void {
  const bills = loadBills();
  const existingIndex = bills.findIndex((b) => b.id === bill.id);

  const savedBill: SavedBill = {
    id: bill.id,
    bookingId: bill.booking.bookingId,
    guestName: bill.guest.name,
    invoiceDate: bill.booking.invoiceDate,
    grandTotal: bill.calculations.grandTotal,
    data: bill,
  };

  if (existingIndex >= 0) {
    bills[existingIndex] = savedBill;
  } else {
    bills.unshift(savedBill);
  }

  localStorage.setItem(SAVED_BILLS_KEY, JSON.stringify(bills));
}

export function loadBills(): SavedBill[] {
  try {
    const data = localStorage.getItem(SAVED_BILLS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteBill(id: string): void {
  const bills = loadBills().filter((b) => b.id !== id);
  localStorage.setItem(SAVED_BILLS_KEY, JSON.stringify(bills));
}

export function getBill(id: string): SavedBill | undefined {
  return loadBills().find((b) => b.id === id);
}

export function searchBills(query: string): SavedBill[] {
  if (!query.trim()) return loadBills();
  const q = query.toLowerCase().trim();
  return loadBills().filter(
    (b) =>
      b.bookingId.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.data.guest.mobile.includes(q) ||
      b.invoiceDate.includes(q)
  );
}
