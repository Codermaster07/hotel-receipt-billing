import type { PaymentInfo, PaymentMethod, PaymentStatus } from '../types/bill';
import { formatIndianCurrency } from '../utils/currency';

interface Props {
  payment: PaymentInfo;
  grandTotal: number;
  onChange: (payment: PaymentInfo) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];
const PAYMENT_STATUSES: PaymentStatus[] = ['Paid', 'Partially Paid', 'Pending'];

export default function PaymentSection({ payment, grandTotal, onChange }: Props) {
  const updatePayment = (field: keyof PaymentInfo, value: string | number) => {
    const updated = { ...payment, [field]: value };

    if (field === 'amountPaid') {
      const paid = Number(value) || 0;
      updated.amountPaid = paid;
      updated.balanceAmount = Math.max(0, grandTotal - paid);

      if (paid >= grandTotal) {
        updated.status = 'Paid';
      } else if (paid > 0) {
        updated.status = 'Partially Paid';
      } else {
        updated.status = 'Pending';
      }
    }

    if (field === 'status') {
      if (value === 'Paid') {
        updated.amountPaid = grandTotal;
        updated.balanceAmount = 0;
      } else if (value === 'Pending') {
        updated.amountPaid = 0;
        updated.balanceAmount = grandTotal;
      }
    }

    onChange(updated);
  };

  const statusColor =
    payment.status === 'Paid'
      ? 'text-emerald-400'
      : payment.status === 'Partially Paid'
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Payment Details
      </h3>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Payment Status</label>
          <select
            id="payment-status"
            className={`form-input font-semibold ${statusColor}`}
            value={payment.status}
            onChange={(e) => updatePayment('status', e.target.value)}
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select
            id="payment-method"
            className="form-input"
            value={payment.method}
            onChange={(e) => updatePayment('method', e.target.value)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount Paid (₹)</label>
          <input
            id="amount-paid"
            type="number"
            min="0"
            className="form-input"
            value={payment.amountPaid}
            onChange={(e) => updatePayment('amountPaid', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Balance Amount</label>
          <div className={`form-input bg-slate-700/50 font-semibold ${payment.balanceAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatIndianCurrency(payment.balanceAmount)}
          </div>
        </div>
      </div>

      {/* Grand Total Display */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300 font-medium">Grand Total</span>
          <span className="text-2xl font-bold text-white">{formatIndianCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
