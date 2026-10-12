import { useState } from 'react';
import type { SavedBill } from '../types/bill';
import { formatIndianCurrency } from '../utils/currency';

interface Props {
  bills: SavedBill[];
  onOpen: (bill: SavedBill) => void;
  onDuplicate: (bill: SavedBill) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function RecentBills({ bills, onOpen, onDuplicate, onDelete, searchQuery, onSearchChange }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Bills
        {bills.length > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-medium">
            {bills.length}
          </span>
        )}
      </h3>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="form-input pl-10 text-sm"
          placeholder="Search by ID, name, mobile, date..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm">No saved bills yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="group p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{bill.bookingId}</span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-sm text-slate-300">{bill.guestName || 'No Name'}</span>
                </div>
                <span className="text-sm font-semibold text-emerald-400">{formatIndianCurrency(bill.grandTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{formatDate(bill.invoiceDate)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpen(bill)}
                    className="px-2.5 py-1 text-xs rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => onDuplicate(bill)}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      confirmDelete === bill.id
                        ? 'bg-red-600 text-white'
                        : 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                    }`}
                  >
                    {confirmDelete === bill.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
