import { useState } from 'react';
import type { HotelInfo } from '../types/bill';
import { DEFAULT_HOTEL } from '../utils/defaults';

interface Props {
  hotel: HotelInfo;
  onChange: (hotel: HotelInfo) => void;
}

export default function HotelForm({ hotel, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const update = (field: keyof HotelInfo, value: unknown) => {
    onChange({ ...hotel, [field]: value });
  };

  const handlePhonesChange = (value: string) => {
    const phones = value
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    onChange({ ...hotel, phones: phones.length > 0 ? phones : [value.trim()] });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_HOTEL });
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/40">
        <h3 className="section-title !mb-0 !pb-0 !border-b-0">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Stay / Property Details
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/50 cursor-pointer"
            title="Reset to default hotel address & info"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
            title={isOpen ? 'Collapse section' : 'Expand section'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3">
          <div className="form-group">
            <label className="form-label flex items-center justify-between">
              <span>Address of the Stay (Top of Bill)</span>
              <span className="text-[10px] text-indigo-400 font-normal">Custom Bill Header</span>
            </label>
            <textarea
              id="hotel-address"
              rows={3}
              className="form-input resize-y min-h-[68px]"
              value={hotel.address || ''}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Enter custom address of the stay (e.g., Sleepwell in Asalpha, Sundar Baug, Ghatkopar West, Mumbai 400084)"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Stay / Property Name</label>
              <input
                id="hotel-name"
                type="text"
                className="form-input"
                value={hotel.name || ''}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g., Codecrax Stay"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone(s)</label>
              <input
                id="hotel-phones"
                type="text"
                className="form-input"
                value={hotel.phones ? hotel.phones.join(', ') : ''}
                onChange={(e) => handlePhonesChange(e.target.value)}
                placeholder="e.g. 7489408614, 9302456117"
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Contact Email</label>
              <input
                id="hotel-email"
                type="email"
                className="form-input"
                value={hotel.email || ''}
                onChange={(e) => update('email', e.target.value)}
                placeholder="e.g. codecrax01@gmail.com"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
