import type { NotesInfo } from '../types/bill';

interface Props {
  notes: NotesInfo;
  onChange: (notes: NotesInfo) => void;
}

export default function NotesSection({ notes, onChange }: Props) {
  const update = (field: keyof NotesInfo, value: string) => {
    onChange({ ...notes, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Notes & Terms
      </h3>

      <div className="space-y-4">
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input min-h-[70px] resize-y"
            value={notes.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Additional notes for the guest..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Terms & Conditions</label>
          <textarea
            className="form-input min-h-[70px] resize-y"
            value={notes.termsAndConditions}
            onChange={(e) => update('termsAndConditions', e.target.value)}
            placeholder="Terms and conditions..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cancellation Policy</label>
          <textarea
            className="form-input min-h-[70px] resize-y"
            value={notes.cancellationPolicy}
            onChange={(e) => update('cancellationPolicy', e.target.value)}
            placeholder="Cancellation policy..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Thank You Message</label>
          <input
            type="text"
            className="form-input"
            value={notes.thankYouMessage}
            onChange={(e) => update('thankYouMessage', e.target.value)}
            placeholder="Thank you message..."
          />
        </div>
      </div>
    </div>
  );
}
