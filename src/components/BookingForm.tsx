import type { BookingInfo, PaymentStatus } from '../types/bill';

interface Props {
  booking: BookingInfo;
  onChange: (booking: BookingInfo) => void;
  onNightsChange: (nights: number) => void;
  errors: Record<string, string>;
}

const ROOM_TYPES = ['Standard', 'Deluxe', 'Super Deluxe', 'Suite', 'Premium', 'Executive', 'Family Room', 'Twin Room'];
const BOOKING_SOURCES = ['Walk-in', 'Phone', 'Website', 'MakeMyTrip', 'Booking.com', 'Goibibo', 'OYO', 'Airbnb', 'Agoda', 'Other'];
const PAYMENT_STATUSES: PaymentStatus[] = ['Paid', 'Partially Paid', 'Pending'];

export default function BookingForm({ booking, onChange, onNightsChange, errors }: Props) {
  const update = (field: keyof BookingInfo, value: string | number) => {
    const updated = { ...booking, [field]: value };

    // Auto-calculate nights when dates change
    if (field === 'checkInDate' || field === 'checkOutDate') {
      const checkIn = field === 'checkInDate' ? value as string : booking.checkInDate;
      const checkOut = field === 'checkOutDate' ? value as string : booking.checkOutDate;
      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (nights > 0) {
          updated.numberOfNights = nights;
          onNightsChange(nights);
        }
      }
    }

    if (field === 'numberOfNights') {
      onNightsChange(value as number);
    }

    onChange(updated);
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Booking Details
      </h3>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Booking ID <span className="text-red-400">*</span>
          </label>
          <input
            id="booking-id"
            type="text"
            className={`form-input font-mono font-semibold ${errors.bookingId ? 'border-red-400!' : ''}`}
            value={booking.bookingId}
            onChange={(e) => update('bookingId', e.target.value)}
          />
          {errors.bookingId && <span className="form-error">{errors.bookingId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Booking Date</label>
          <input
            id="booking-date"
            type="date"
            className="form-input"
            value={booking.bookingDate}
            onChange={(e) => update('bookingDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Invoice Date</label>
          <input
            id="invoice-date"
            type="date"
            className="form-input"
            value={booking.invoiceDate}
            onChange={(e) => update('invoiceDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Check-in Date</label>
          <input
            id="checkin-date"
            type="date"
            className={`form-input ${errors.checkInDate ? 'border-red-400!' : ''}`}
            value={booking.checkInDate}
            onChange={(e) => update('checkInDate', e.target.value)}
          />
          {errors.checkInDate && <span className="form-error">{errors.checkInDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Check-in Time</label>
          <input
            id="checkin-time"
            type="time"
            className="form-input"
            value={booking.checkInTime}
            onChange={(e) => update('checkInTime', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Check-out Date</label>
          <input
            id="checkout-date"
            type="date"
            className={`form-input ${errors.checkOutDate ? 'border-red-400!' : ''}`}
            value={booking.checkOutDate}
            onChange={(e) => update('checkOutDate', e.target.value)}
          />
          {errors.checkOutDate && <span className="form-error">{errors.checkOutDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Check-out Time</label>
          <input
            id="checkout-time"
            type="time"
            className="form-input"
            value={booking.checkOutTime}
            onChange={(e) => update('checkOutTime', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Nights</label>
          <input
            id="num-nights"
            type="number"
            min="1"
            className="form-input"
            value={booking.numberOfNights}
            onChange={(e) => update('numberOfNights', Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Guests</label>
          <input
            id="num-guests"
            type="number"
            min="1"
            className="form-input"
            value={booking.numberOfGuests}
            onChange={(e) => update('numberOfGuests', Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Room Number</label>
          <input
            id="room-number"
            type="text"
            className="form-input"
            value={booking.roomNumber}
            onChange={(e) => update('roomNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Room Type</label>
          <select
            id="room-type"
            className="form-input"
            value={booking.roomType}
            onChange={(e) => update('roomType', e.target.value)}
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Booking Source</label>
          <select
            id="booking-source"
            className="form-input"
            value={booking.bookingSource}
            onChange={(e) => update('bookingSource', e.target.value)}
          >
            {BOOKING_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Status</label>
          <select
            id="payment-status-booking"
            className="form-input"
            value={booking.paymentStatus}
            onChange={(e) => update('paymentStatus', e.target.value)}
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
