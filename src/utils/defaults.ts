import type {
  HotelInfo,
  GuestInfo,
  BookingInfo,
  RoomDetails,
  BillingItem,
  TaxConfig,
  DiscountConfig,
  PaymentInfo,
  NotesInfo,
  BillData,
  BillCalculations,
} from '../types/bill';
import { peekNextBookingId } from './bookingId';

export const DEFAULT_HOTEL: HotelInfo = {
  name: 'Codecrax Stay',
  address:
    'Sleepwell in Asalpha, Sundar Baug, Nari Seva Sadan, Hanuman Compound, Asalpha Village, Ghatkopar West, Mumbai, Maharashtra 400084',
  city: 'Mumbai',
  state: 'Maharashtra',
  pinCode: '400084',
  phones: ['7489408614', '9302456117'],
  email: 'codecrax01@gmail.com',
};

export function getDefaultGuest(): GuestInfo {
  return {
    name: 'Harsh Chouksey',
    mobile: '9876543210',
    email: 'harsh@example.com',
    address: '123, Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    idType: 'Aadhaar',
    idNumber: 'XXXX-XXXX-1234',
    companyName: '',
  };
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

export function getDefaultBooking(): BookingInfo {
  return {
    bookingId: peekNextBookingId(),
    bookingDate: getTodayStr(),
    invoiceDate: getTodayStr(),
    checkInDate: getTodayStr(),
    checkInTime: '14:00',
    checkOutDate: getTomorrowStr(),
    checkOutTime: '11:00',
    numberOfNights: 2,
    numberOfGuests: 2,
    roomNumber: '101',
    roomType: 'Deluxe',
    bookingSource: 'Walk-in',
    paymentStatus: 'Paid',
  };
}

export function getDefaultRoom(): RoomDetails {
  return {
    roomNumber: '101',
    roomType: 'Deluxe',
    ratePerNight: 2500,
    numberOfNights: 2,
    roomAmount: 5000,
  };
}

export function getDefaultBillingItems(): BillingItem[] {
  return [
    {
      id: crypto.randomUUID(),
      description: 'Room Charges',
      quantity: 2,
      rate: 2500,
      amount: 5000,
    },
  ];
}

export function getDefaultTax(): TaxConfig {
  return {
    enabled: false,
    taxName: 'Service Tax',
    taxPercentage: 0,
  };
}

export function getDefaultDiscount(): DiscountConfig {
  return {
    enabled: false,
    type: 'fixed',
    value: 0,
  };
}

export function getDefaultPayment(): PaymentInfo {
  return {
    status: 'Paid',
    method: 'Cash',
    amountPaid: 5000,
    balanceAmount: 0,
  };
}

export function getDefaultNotes(): NotesInfo {
  return {
    notes: '',
    termsAndConditions: 'Check-out time is 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.',
    cancellationPolicy: 'Cancellations made 24 hours before check-in are fully refundable. No-shows will be charged for one night.',
    thankYouMessage: 'Thank you for staying with Codecrax Stay! We hope you had a pleasant experience.',
  };
}

export function getDefaultCalculations(): BillCalculations {
  return {
    subtotal: 5000,
    discountAmount: 0,
    taxableAmount: 5000,
    taxAmount: 0,
    grandTotal: 5000,
    balanceAmount: 0,
  };
}

export function createDefaultBillData(): BillData {
  return {
    id: crypto.randomUUID(),
    hotel: { ...DEFAULT_HOTEL },
    guest: getDefaultGuest(),
    booking: getDefaultBooking(),
    room: getDefaultRoom(),
    billingItems: getDefaultBillingItems(),
    tax: getDefaultTax(),
    discount: getDefaultDiscount(),
    payment: getDefaultPayment(),
    notes: getDefaultNotes(),
    calculations: getDefaultCalculations(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
