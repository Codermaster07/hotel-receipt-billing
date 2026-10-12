import type { BillingItem } from '../types/bill';
import { calculateItemAmount } from '../utils/calculations';
import { formatIndianCurrency } from '../utils/currency';

interface Props {
  items: BillingItem[];
  onChange: (items: BillingItem[]) => void;
}

const SUGGESTIONS = [
  'Room Charges',
  'Food',
  'Restaurant',
  'Laundry',
  'Extra Bed',
  'Room Service',
  'Mini Bar',
  'Parking',
  'Wi-Fi',
  'Airport Transfer',
  'Spa',
  'Other',
];

export default function BillingItems({ items, onChange }: Props) {
  const addItem = () => {
    const newItem: BillingItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof BillingItem, value: string | number) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'description') {
      item.description = value as string;
    } else if (field === 'quantity') {
      item.quantity = Math.max(0, Number(value) || 0);
      item.amount = calculateItemAmount(item.quantity, item.rate);
    } else if (field === 'rate') {
      item.rate = Math.max(0, Number(value) || 0);
      item.amount = calculateItemAmount(item.quantity, item.rate);
    }

    updated[index] = item;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Billing Items
      </h3>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[1fr_80px_100px_110px_44px] gap-2 mb-2 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qty</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate (₹)</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</span>
        <span></span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_110px_44px] gap-2 items-center bg-slate-800/40 rounded-lg p-3 sm:p-2 border border-slate-700/50"
          >
            <div>
              <label className="text-xs text-slate-400 sm:hidden mb-1 block">Description</label>
              <input
                type="text"
                className="form-input text-sm"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="Item description"
                list={`suggestions-${item.id}`}
              />
              <datalist id={`suggestions-${item.id}`}>
                {SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs text-slate-400 sm:hidden mb-1 block">Quantity</label>
              <input
                type="number"
                min="0"
                className="form-input text-sm text-center"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 sm:hidden mb-1 block">Rate (₹)</label>
              <input
                type="number"
                min="0"
                className="form-input text-sm text-right"
                value={item.rate}
                onChange={(e) => updateItem(index, 'rate', e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label className="text-xs text-slate-400 sm:hidden mb-1 block mr-2">Amount</label>
              <span className="text-sm font-semibold text-emerald-400 w-full text-right pr-2">
                {formatIndianCurrency(item.amount)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed self-end sm:self-center"
              title="Remove item"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </button>
    </div>
  );
}
