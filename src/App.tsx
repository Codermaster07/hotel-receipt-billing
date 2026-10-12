import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  BillData,
  HotelInfo,
  GuestInfo,
  BookingInfo,
  BillingItem,
  TaxConfig,
  DiscountConfig,
  PaymentInfo,
  NotesInfo,
  SavedBill,
} from './types/bill';
import { calculateAll, calculateItemAmount } from './utils/calculations';
import { getNextBookingId, peekNextBookingId } from './utils/bookingId';
import { formatIndianCurrency } from './utils/currency';
import { generatePDF, printBill } from './utils/pdfGenerator';
import { saveBill as saveBillToStorage, loadBills, deleteBill as deleteBillFromStorage, searchBills } from './utils/storage';
import { createDefaultBillData, DEFAULT_HOTEL, getDefaultGuest, getDefaultBooking, getDefaultRoom, getDefaultBillingItems, getDefaultTax, getDefaultDiscount, getDefaultPayment, getDefaultNotes, getDefaultCalculations } from './utils/defaults';

import HotelForm from './components/HotelForm';
import GuestForm from './components/GuestForm';
import BookingForm from './components/BookingForm';
import BillingItems from './components/BillingItems';
import TaxSection from './components/TaxSection';
import PaymentSection from './components/PaymentSection';
import NotesSection from './components/NotesSection';
import BillPreview from './components/BillPreview';
import RecentBills from './components/RecentBills';
import Toast from './components/Toast';

export default function App() {
  // ─── State ───────────────────────────────────────────────────────
  const [bill, setBill] = useState<BillData>(() => createDefaultBillData());
  const [savedBillsList, setSavedBillsList] = useState<SavedBill[]>(() => loadBills());
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // ─── Recalculate on changes ──────────────────────────────────────
  const recalculate = useCallback(
    (data: BillData): BillData => {
      const calcs = calculateAll(data.billingItems, data.tax, data.discount, data.payment.amountPaid);
      return {
        ...data,
        calculations: calcs,
        payment: {
          ...data.payment,
          balanceAmount: calcs.balanceAmount,
        },
        updatedAt: new Date().toISOString(),
      };
    },
    []
  );

  const updateBill = useCallback(
    (updater: (prev: BillData) => BillData) => {
      setBill((prev) => {
        const updated = updater(prev);
        setIsDirty(true);
        return recalculate(updated);
      });
    },
    [recalculate]
  );

  // ─── Hotel / Stay Handlers ───────────────────────────────────────
  const handleHotelChange = useCallback(
    (hotel: HotelInfo) => {
      updateBill((prev) => ({ ...prev, hotel }));
    },
    [updateBill]
  );

  // ─── Guest Handlers ──────────────────────────────────────────────
  const handleGuestChange = useCallback(
    (guest: GuestInfo) => {
      updateBill((prev) => ({ ...prev, guest }));
      if (guest.name) {
        setErrors((prev) => {
          const { guestName, ...rest } = prev;
          return rest;
        });
      }
    },
    [updateBill]
  );

  // ─── Booking Handlers ────────────────────────────────────────────
  const handleBookingChange = useCallback(
    (booking: BookingInfo) => {
      updateBill((prev) => ({
        ...prev,
        booking,
        room: {
          ...prev.room,
          roomNumber: booking.roomNumber,
          roomType: booking.roomType,
          numberOfNights: booking.numberOfNights,
          roomAmount: prev.room.ratePerNight * booking.numberOfNights,
        },
      }));
    },
    [updateBill]
  );

  const handleNightsChange = useCallback(
    (nights: number) => {
      updateBill((prev) => {
        // Update the first billing item (Room Charges) if it exists
        const items = prev.billingItems.map((item, i) => {
          if (i === 0 && item.description === 'Room Charges') {
            return {
              ...item,
              quantity: nights,
              amount: calculateItemAmount(nights, item.rate),
            };
          }
          return item;
        });
        return {
          ...prev,
          billingItems: items,
          room: {
            ...prev.room,
            numberOfNights: nights,
            roomAmount: prev.room.ratePerNight * nights,
          },
        };
      });
    },
    [updateBill]
  );

  // ─── Billing Items Handlers ──────────────────────────────────────
  const handleItemsChange = useCallback(
    (items: BillingItem[]) => {
      updateBill((prev) => ({ ...prev, billingItems: items }));
    },
    [updateBill]
  );

  // ─── Tax & Discount Handlers ─────────────────────────────────────
  const handleTaxChange = useCallback(
    (tax: TaxConfig) => {
      updateBill((prev) => ({ ...prev, tax }));
    },
    [updateBill]
  );

  const handleDiscountChange = useCallback(
    (discount: DiscountConfig) => {
      updateBill((prev) => ({ ...prev, discount }));
    },
    [updateBill]
  );

  // ─── Payment Handlers ────────────────────────────────────────────
  const handlePaymentChange = useCallback(
    (payment: PaymentInfo) => {
      updateBill((prev) => ({ ...prev, payment }));
    },
    [updateBill]
  );

  // ─── Notes Handlers ──────────────────────────────────────────────
  const handleNotesChange = useCallback(
    (notes: NotesInfo) => {
      updateBill((prev) => ({ ...prev, notes }));
    },
    [updateBill]
  );

  // ─── Validation ──────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bill.guest.name.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!bill.booking.bookingId.trim()) {
      newErrors.bookingId = 'Booking ID is required';
    }
    if (bill.booking.checkOutDate && bill.booking.checkInDate) {
      if (new Date(bill.booking.checkOutDate) < new Date(bill.booking.checkInDate)) {
        newErrors.checkOutDate = 'Check-out cannot be before check-in';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bill]);

  // ─── Save Bill ───────────────────────────────────────────────────
  const handleSaveBill = useCallback(() => {
    if (!validate()) {
      setToast({ message: 'Please fix errors before saving', type: 'error' });
      return;
    }

    saveBillToStorage(bill);
    setSavedBillsList(loadBills());
    setIsDirty(false);
    setToast({ message: 'Bill saved successfully!', type: 'success' });
  }, [bill, validate]);

  // ─── PDF ─────────────────────────────────────────────────────────
  const handleDownloadPDF = useCallback(async () => {
    if (!validate()) {
      setToast({ message: 'Please fix errors before generating PDF', type: 'error' });
      return;
    }

    setIsPdfGenerating(true);
    try {
      const guestName = bill.guest.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const filename = `CodecraxStay_${bill.booking.bookingId}_${guestName || 'Guest'}`;
      await generatePDF('bill-preview', filename);
      setToast({ message: 'PDF downloaded successfully!', type: 'success' });
    } catch (err) {
      console.error('PDF generation error:', err);
      setToast({ message: 'Failed to generate PDF', type: 'error' });
    } finally {
      setIsPdfGenerating(false);
    }
  }, [bill, validate]);

  // ─── Print ───────────────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    printBill('bill-preview');
  }, []);

  // ─── New Bill ────────────────────────────────────────────────────
  const handleNewBill = useCallback(() => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Create a new bill anyway?')) {
        return;
      }
    }

    const newBookingId = getNextBookingId();
    const newBill = createDefaultBillData();
    newBill.hotel = { ...bill.hotel };
    newBill.guest = { ...getDefaultGuest(), name: '', mobile: '', email: '', address: '', idNumber: '', companyName: '' };
    newBill.booking = { ...getDefaultBooking(), bookingId: newBookingId };
    newBill.billingItems = getDefaultBillingItems();
    newBill.payment = getDefaultPayment();
    newBill.calculations = getDefaultCalculations();

    setBill(recalculate(newBill));
    setIsDirty(false);
    setErrors({});
    setToast({ message: `New bill created: ${newBookingId}`, type: 'info' });
  }, [isDirty, recalculate]);

  // ─── Open Saved Bill ─────────────────────────────────────────────
  const handleOpenBill = useCallback((saved: SavedBill) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Open a different bill?')) {
        return;
      }
    }
    setBill(saved.data);
    setIsDirty(false);
    setErrors({});
    setShowMobilePreview(false);
  }, [isDirty]);

  // ─── Duplicate Bill ──────────────────────────────────────────────
  const handleDuplicateBill = useCallback((saved: SavedBill) => {
    const newBookingId = getNextBookingId();
    const duplicated: BillData = {
      ...saved.data,
      id: crypto.randomUUID(),
      booking: { ...saved.data.booking, bookingId: newBookingId },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBill(duplicated);
    setIsDirty(true);
    setToast({ message: `Bill duplicated as ${newBookingId}`, type: 'info' });
  }, []);

  // ─── Delete Bill ─────────────────────────────────────────────────
  const handleDeleteBill = useCallback((id: string) => {
    deleteBillFromStorage(id);
    setSavedBillsList(loadBills());
    setToast({ message: 'Bill deleted', type: 'success' });
  }, []);

  // ─── Search ──────────────────────────────────────────────────────
  const filteredBills = useMemo(() => {
    return searchQuery ? searchBills(searchQuery) : savedBillsList;
  }, [searchQuery, savedBillsList]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20">
                CS
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Codecrax Stay</h1>
                <p className="text-[11px] text-slate-400 -mt-0.5">Hotel Bill Generator</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveBill}
                className="action-btn action-btn-primary"
                title="Save Bill"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isPdfGenerating}
                className="action-btn action-btn-success"
                title="Download PDF"
              >
                {isPdfGenerating ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isPdfGenerating ? 'Generating...' : 'PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="action-btn action-btn-secondary"
                title="Print Bill"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="hidden sm:inline">Print</span>
              </button>

              <div className="w-px h-8 bg-slate-700 mx-1 hidden sm:block" />

              <button
                onClick={handleNewBill}
                className="action-btn action-btn-outline"
                title="New Bill"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Bill</span>
              </button>

              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="action-btn action-btn-secondary lg:hidden"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">{showMobilePreview ? 'Form' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── LEFT: Form ─── */}
          <div className={`w-full lg:w-[520px] xl:w-[560px] flex-shrink-0 space-y-4 ${showMobilePreview ? 'hidden lg:block' : ''}`}>
            <HotelForm hotel={bill.hotel} onChange={handleHotelChange} />
            <BookingForm
              booking={bill.booking}
              onChange={handleBookingChange}
              onNightsChange={handleNightsChange}
              errors={errors}
            />
            <GuestForm guest={bill.guest} onChange={handleGuestChange} errors={errors} />
            <BillingItems items={bill.billingItems} onChange={handleItemsChange} />
            <TaxSection
              tax={bill.tax}
              discount={bill.discount}
              onTaxChange={handleTaxChange}
              onDiscountChange={handleDiscountChange}
            />
            <PaymentSection
              payment={bill.payment}
              grandTotal={bill.calculations.grandTotal}
              onChange={handlePaymentChange}
            />
            <NotesSection notes={bill.notes} onChange={handleNotesChange} />
            <RecentBills
              bills={filteredBills}
              onOpen={handleOpenBill}
              onDuplicate={handleDuplicateBill}
              onDelete={handleDeleteBill}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* ─── RIGHT: Bill Preview ─── */}
          <div className={`flex-1 min-w-0 ${showMobilePreview ? '' : 'hidden lg:block'}`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Bill Preview
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {bill.booking.bookingId} | {formatIndianCurrency(bill.calculations.grandTotal)}
                </span>
              </div>

              <div className="overflow-auto max-h-[calc(100vh-120px)] rounded-xl border border-slate-800/50 shadow-2xl shadow-black/20 custom-scrollbar">
                <div className="min-w-[794px]">
                  <BillPreview bill={bill} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Toast ─── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
