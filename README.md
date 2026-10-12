# Codecrax Stay — Hotel Bill Generator

A professional, production-ready single-page Hotel Bill Generator built for **Codecrax Stay**. Generate, preview, download, and print hotel invoices entirely in the browser.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Instant Bill Generation** — Fill in guest & booking details, get a live A4 bill preview
- **Professional Invoice Layout** — Clean print-ready design with proper margins, borders, and typography
- **PDF Download** — High-quality A4 PDF via jsPDF + html2canvas
- **Print Support** — Dedicated print window with proper `@page` CSS
- **Auto Booking IDs** — Sequential `CSS01`, `CSS02`… IDs persisted in localStorage
- **Indian Currency** — `₹1,25,000` formatting with amount-in-words (Lakh/Crore)
- **Dynamic Billing Items** — Add unlimited charge items with auto-calculation
- **Configurable Tax & Discount** — Optional generic tax (no GST), fixed or percentage discount
- **Payment Tracking** — Status, method, amount paid, balance auto-calculation
- **Saved Bills** — localStorage persistence with search, open, duplicate, delete
- **Responsive** — Desktop: side-by-side form + preview; Mobile: stacked layout
- **Zero Backend** — Runs entirely in the browser

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── BillPreview.tsx       # A4 invoice preview (print-ready)
│   ├── BookingForm.tsx       # Booking details form
│   ├── GuestForm.tsx         # Guest information form
│   ├── BillingItems.tsx      # Dynamic billing items table
│   ├── TaxSection.tsx        # Tax & discount configuration
│   ├── PaymentSection.tsx    # Payment status & method
│   ├── NotesSection.tsx      # Notes, T&C, footer
│   ├── RecentBills.tsx       # Saved bills list with search
│   └── Toast.tsx             # Notification toast
├── utils/
│   ├── calculations.ts       # Subtotal, tax, discount, balance
│   ├── currency.ts           # Indian currency formatting
│   ├── amountInWords.ts      # Number → Indian words converter
│   ├── bookingId.ts          # Sequential booking ID generator
│   ├── pdfGenerator.ts       # PDF & print utilities
│   ├── storage.ts            # localStorage CRUD & search
│   └── defaults.ts           # Default hotel, guest, booking data
├── types/
│   └── bill.ts               # TypeScript type definitions
├── App.tsx                   # Main application component
├── main.tsx                  # React entry point
└── index.css                 # Tailwind + bill preview + print CSS
```

## 🏨 Hotel Information

| Field | Value |
|-------|-------|
| Hotel Name | Codecrax Stay |
| Address | Sleepwell in Asalpha, Sundar Baug, Nari Seva Sadan, Hanuman Compound, Asalpha Village, Ghatkopar West, Mumbai, Maharashtra 400084 |
| Phone | 7489408614 / 9302456117 |
| Email | codecrax01@gmail.com |

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (build tool)
- **Tailwind CSS 4** (application UI styling)
- **jsPDF** + **html2canvas-pro** (PDF generation)
- **localStorage** (data persistence)

## 📄 License

MIT
