import type { GuestInfo } from '../types/bill';

interface Props {
  guest: GuestInfo;
  onChange: (guest: GuestInfo) => void;
  errors: Record<string, string>;
}

const ID_TYPES = ['Aadhaar', 'PAN Card', 'Passport', 'Driving License', 'Voter ID', 'Other'];

export default function GuestForm({ guest, onChange, errors }: Props) {
  const update = (field: keyof GuestInfo, value: string) => {
    onChange({ ...guest, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Guest Details
      </h3>

      <div className="form-grid">
        <div className="form-group col-span-2">
          <label className="form-label">
            Guest Name <span className="text-red-400">*</span>
          </label>
          <input
            id="guest-name"
            type="text"
            className={`form-input ${errors.guestName ? 'border-red-400!' : ''}`}
            value={guest.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Enter guest name"
          />
          {errors.guestName && <span className="form-error">{errors.guestName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Mobile Number</label>
          <input
            id="guest-mobile"
            type="tel"
            className="form-input"
            value={guest.mobile}
            onChange={(e) => update('mobile', e.target.value)}
            placeholder="10-digit mobile"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            id="guest-email"
            type="email"
            className="form-input"
            value={guest.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Address</label>
          <input
            id="guest-address"
            type="text"
            className="form-input"
            value={guest.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="Street address"
          />
        </div>

        <div className="form-group">
          <label className="form-label">City</label>
          <input
            id="guest-city"
            type="text"
            className="form-input"
            value={guest.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="City"
          />
        </div>

        <div className="form-group">
          <label className="form-label">State</label>
          <input
            id="guest-state"
            type="text"
            className="form-input"
            value={guest.state}
            onChange={(e) => update('state', e.target.value)}
            placeholder="State"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Country</label>
          <input
            id="guest-country"
            type="text"
            className="form-input"
            value={guest.country}
            onChange={(e) => update('country', e.target.value)}
            placeholder="Country"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            id="guest-company"
            type="text"
            className="form-input"
            value={guest.companyName}
            onChange={(e) => update('companyName', e.target.value)}
            placeholder="Company (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">ID Type</label>
          <select
            id="guest-id-type"
            className="form-input"
            value={guest.idType}
            onChange={(e) => update('idType', e.target.value)}
          >
            <option value="">Select ID Type</option>
            {ID_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">ID Number</label>
          <input
            id="guest-id-number"
            type="text"
            className="form-input"
            value={guest.idNumber}
            onChange={(e) => update('idNumber', e.target.value)}
            placeholder="ID number"
          />
        </div>
      </div>
    </div>
  );
}
