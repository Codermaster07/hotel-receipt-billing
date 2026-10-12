// ─── Bill Data Types ───────────────────────────────────────────────

export interface HotelInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phones: string[];
  email: string;
}

export interface GuestInfo {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  companyName: string;
}

export interface BookingInfo {
  bookingId: string;
  bookingDate: string;
  invoiceDate: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  numberOfNights: number;
  numberOfGuests: number;
  roomNumber: string;
  roomType: string;
  bookingSource: string;
  paymentStatus: PaymentStatus;
}

export interface RoomDetails {
  roomNumber: string;
  roomType: string;
  ratePerNight: number;
  numberOfNights: number;
  roomAmount: number;
}

export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TaxConfig {
  enabled: boolean;
  taxName: string;
  taxPercentage: number;
}

export interface DiscountConfig {
  enabled: boolean;
  type: 'fixed' | 'percentage';
  value: number;
}

export interface PaymentInfo {
  status: PaymentStatus;
  method: PaymentMethod;
  amountPaid: number;
  balanceAmount: number;
}

export interface NotesInfo {
  notes: string;
  termsAndConditions: string;
  cancellationPolicy: string;
  thankYouMessage: string;
}

export interface BillCalculations {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
  balanceAmount: number;
}

export interface BillData {
  id: string;
  hotel: HotelInfo;
  guest: GuestInfo;
  booking: BookingInfo;
  room: RoomDetails;
  billingItems: BillingItem[];
  tax: TaxConfig;
  discount: DiscountConfig;
  payment: PaymentInfo;
  notes: NotesInfo;
  calculations: BillCalculations;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Other';

export interface SavedBill {
  id: string;
  bookingId: string;
  guestName: string;
  invoiceDate: string;
  grandTotal: number;
  data: BillData;
}
