import type { TaxConfig, DiscountConfig } from '../types/bill';

interface Props {
  tax: TaxConfig;
  discount: DiscountConfig;
  onTaxChange: (tax: TaxConfig) => void;
  onDiscountChange: (discount: DiscountConfig) => void;
}

export default function TaxSection({ tax, discount, onTaxChange, onDiscountChange }: Props) {
  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Tax & Discount
      </h3>

      <div className="space-y-4">
        {/* Tax Toggle */}
        <div className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
          <div>
            <p className="text-sm font-medium text-slate-200">Enable Tax</p>
            <p className="text-xs text-slate-400 mt-0.5">Add a configurable tax to the bill</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={tax.enabled}
              onChange={(e) => onTaxChange({ ...tax, enabled: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {tax.enabled && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tax Name</label>
              <input
                type="text"
                className="form-input"
                value={tax.taxName}
                onChange={(e) => onTaxChange({ ...tax, taxName: e.target.value })}
                placeholder="e.g., Service Tax"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tax Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                value={tax.taxPercentage}
                onChange={(e) => onTaxChange({ ...tax, taxPercentage: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>
        )}

        {/* Discount Toggle */}
        <div className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
          <div>
            <p className="text-sm font-medium text-slate-200">Enable Discount</p>
            <p className="text-xs text-slate-400 mt-0.5">Apply a discount to the subtotal</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={discount.enabled}
              onChange={(e) => onDiscountChange({ ...discount, enabled: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {discount.enabled && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select
                className="form-input"
                value={discount.type}
                onChange={(e) => onDiscountChange({ ...discount, type: e.target.value as 'fixed' | 'percentage' })}
              >
                <option value="fixed">Fixed Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                {discount.type === 'percentage' ? 'Discount (%)' : 'Discount Amount (₹)'}
              </label>
              <input
                type="number"
                min="0"
                max={discount.type === 'percentage' ? 100 : undefined}
                step={discount.type === 'percentage' ? 0.5 : 1}
                className="form-input"
                value={discount.value}
                onChange={(e) => onDiscountChange({ ...discount, value: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
