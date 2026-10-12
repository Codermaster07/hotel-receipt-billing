import type { BillData } from '../types/bill';
import { formatIndianCurrency } from '../utils/currency';
import { numberToIndianWords } from '../utils/amountInWords';

interface Props {
  bill: BillData;
}

export default function BillPreview({ bill }: Props) {
  const { hotel, guest, booking, billingItems, tax, discount, calculations, payment, notes } = bill;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '—';
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div
      id="bill-preview"
      className="bill-page"
    >
      {/* ─── Outer Border Container ─── */}
      <div className="bill-border">

        {/* ═══════════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-header">
          <h1 className="bill-hotel-name">{hotel.name || 'Codecrax Stay'}</h1>
          {hotel.address && <p className="bill-hotel-address">{hotel.address}</p>}
          {(hotel.phones?.some(Boolean) || hotel.email) && (
            <p className="bill-hotel-contact">
              {hotel.phones?.filter(Boolean).length > 0 && `Phone: ${hotel.phones.filter(Boolean).join(' / ')}`}
              {hotel.phones?.filter(Boolean).length > 0 && hotel.email && ' \u00A0|\u00A0 '}
              {hotel.email && `Email: ${hotel.email}`}
            </p>
          )}
        </div>

        <div className="bill-separator-thick" />

        {/* ═══════════════════════════════════════════════════════════
            INVOICE TITLE + BOOKING ID ROW
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-invoice-title-row">
          <span className="bill-invoice-label">INVOICE</span>
          <span className="bill-invoice-id">{booking.bookingId}</span>
        </div>

        <div className="bill-separator" />

        {/* ═══════════════════════════════════════════════════════════
            GUEST + BOOKING INFO (Two columns)
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-two-col">
          {/* Left: Guest Details */}
          <div className="bill-col">
            <p className="bill-section-label">GUEST DETAILS</p>
            <table className="bill-info-table">
              <tbody>
                <tr>
                  <td className="bill-info-label">Guest Name</td>
                  <td className="bill-info-value bill-info-value-bold">{guest.name || '—'}</td>
                </tr>
                {guest.companyName && (
                  <tr>
                    <td className="bill-info-label">Company</td>
                    <td className="bill-info-value">{guest.companyName}</td>
                  </tr>
                )}
                {guest.mobile && (
                  <tr>
                    <td className="bill-info-label">Mobile</td>
                    <td className="bill-info-value">{guest.mobile}</td>
                  </tr>
                )}
                {guest.email && (
                  <tr>
                    <td className="bill-info-label">Email</td>
                    <td className="bill-info-value">{guest.email}</td>
                  </tr>
                )}
                {guest.address && (
                  <tr>
                    <td className="bill-info-label">Address</td>
                    <td className="bill-info-value">
                      {guest.address}
                      {guest.city || guest.state || guest.country ? (
                        <>, {[guest.city, guest.state, guest.country].filter(Boolean).join(', ')}</>
                      ) : null}
                    </td>
                  </tr>
                )}
                {guest.idType && guest.idNumber && (
                  <tr>
                    <td className="bill-info-label">{guest.idType}</td>
                    <td className="bill-info-value">{guest.idNumber}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Right: Booking Details */}
          <div className="bill-col">
            <p className="bill-section-label">BOOKING DETAILS</p>
            <table className="bill-info-table">
              <tbody>
                <tr>
                  <td className="bill-info-label">Invoice Date</td>
                  <td className="bill-info-value">{formatDate(booking.invoiceDate)}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Booking Date</td>
                  <td className="bill-info-value">{formatDate(booking.bookingDate)}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Check-in</td>
                  <td className="bill-info-value">{formatDate(booking.checkInDate)}, {formatTime(booking.checkInTime)}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Check-out</td>
                  <td className="bill-info-value">{formatDate(booking.checkOutDate)}, {formatTime(booking.checkOutTime)}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Room No.</td>
                  <td className="bill-info-value">{booking.roomNumber}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Room Type</td>
                  <td className="bill-info-value">{booking.roomType}</td>
                </tr>
                <tr>
                  <td className="bill-info-label">Nights / Guests</td>
                  <td className="bill-info-value">
                    {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''} / {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                  </td>
                </tr>
                <tr>
                  <td className="bill-info-label">Source</td>
                  <td className="bill-info-value">{booking.bookingSource}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bill-separator" />

        {/* ═══════════════════════════════════════════════════════════
            BILLING TABLE
        ═══════════════════════════════════════════════════════════ */}
        <p className="bill-section-label" style={{ marginBottom: '6px' }}>CHARGES</p>
        <table className="bill-table">
          <thead>
            <tr>
              <th className="bill-th bill-th-left" style={{ width: '36px' }}>#</th>
              <th className="bill-th bill-th-left">Description</th>
              <th className="bill-th bill-th-center" style={{ width: '55px' }}>Qty</th>
              <th className="bill-th bill-th-right" style={{ width: '100px' }}>Rate (₹)</th>
              <th className="bill-th bill-th-right" style={{ width: '110px' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {billingItems.map((item, index) => (
              <tr key={item.id}>
                <td className="bill-td bill-td-center">{index + 1}</td>
                <td className="bill-td">{item.description || '—'}</td>
                <td className="bill-td bill-td-center">{item.quantity}</td>
                <td className="bill-td bill-td-right">{formatIndianCurrency(item.rate)}</td>
                <td className="bill-td bill-td-right bill-td-bold">{formatIndianCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ═══════════════════════════════════════════════════════════
            TOTALS
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-totals-row">
          <div className="bill-totals-spacer" />
          <div className="bill-totals-block">
            <div className="bill-total-line">
              <span>Subtotal</span>
              <span>{formatIndianCurrency(calculations.subtotal)}</span>
            </div>

            {discount.enabled && calculations.discountAmount > 0 && (
              <div className="bill-total-line">
                <span>Discount{discount.type === 'percentage' ? ` (${discount.value}%)` : ''}</span>
                <span style={{ color: '#b91c1c' }}>-{formatIndianCurrency(calculations.discountAmount)}</span>
              </div>
            )}

            {tax.enabled && calculations.taxAmount > 0 && (
              <>
                <div className="bill-total-line">
                  <span>Taxable Amount</span>
                  <span>{formatIndianCurrency(calculations.taxableAmount)}</span>
                </div>
                <div className="bill-total-line">
                  <span>{tax.taxName} ({tax.taxPercentage}%)</span>
                  <span>{formatIndianCurrency(calculations.taxAmount)}</span>
                </div>
              </>
            )}

            <div className="bill-grand-total-line">
              <span>GRAND TOTAL</span>
              <span>{formatIndianCurrency(calculations.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            AMOUNT IN WORDS
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-words">
          <span className="bill-words-label">Amount in Words:</span>{' '}
          {numberToIndianWords(calculations.grandTotal)}
        </div>

        <div className="bill-separator" />

        {/* ═══════════════════════════════════════════════════════════
            PAYMENT DETAILS
        ═══════════════════════════════════════════════════════════ */}
        <p className="bill-section-label" style={{ marginBottom: '6px' }}>PAYMENT DETAILS</p>
        <div className="bill-payment-grid">
          <div className="bill-payment-item">
            <span className="bill-payment-label">Payment Method</span>
            <span className="bill-payment-value">{payment.method}</span>
          </div>
          <div className="bill-payment-item">
            <span className="bill-payment-label">Amount Paid</span>
            <span className="bill-payment-value">{formatIndianCurrency(payment.amountPaid)}</span>
          </div>
          <div className="bill-payment-item">
            <span className="bill-payment-label">Balance Due</span>
            <span className="bill-payment-value" style={{ color: calculations.balanceAmount > 0 ? '#b91c1c' : '#15803d' }}>
              {formatIndianCurrency(calculations.balanceAmount)}
            </span>
          </div>
          <div className="bill-payment-item">
            <span className="bill-payment-label">Status</span>
            <span className="bill-payment-value" style={{
              fontWeight: 700,
              color: payment.status === 'Paid' ? '#15803d' : payment.status === 'Partially Paid' ? '#a16207' : '#b91c1c'
            }}>
              {payment.status}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            NOTES / TERMS / FOOTER
        ═══════════════════════════════════════════════════════════ */}
        {(notes.notes || notes.termsAndConditions || notes.cancellationPolicy) && (
          <>
            <div className="bill-separator" />
            <div className="bill-notes-block">
              {notes.notes && (
                <div className="bill-note-item">
                  <span className="bill-note-label">Notes:</span> {notes.notes}
                </div>
              )}
              {notes.termsAndConditions && (
                <div className="bill-note-item">
                  <span className="bill-note-label">Terms & Conditions:</span> {notes.termsAndConditions}
                </div>
              )}
              {notes.cancellationPolicy && (
                <div className="bill-note-item">
                  <span className="bill-note-label">Cancellation Policy:</span> {notes.cancellationPolicy}
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════ */}
        <div className="bill-footer">
          {notes.thankYouMessage && (
            <p className="bill-thank-you">{notes.thankYouMessage}</p>
          )}
          <p className="bill-computer-gen">This is a computer-generated invoice and does not require a signature.</p>
        </div>

      </div>
    </div>
  );
}
