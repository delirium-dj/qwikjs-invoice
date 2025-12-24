# 🧾 Qwik Invoice Generator

A modern, interactive invoice generator built with **Qwik** and **QwikCity**. Create professional invoices, customize with your logo, and export to PDF — all client-side with instant responsiveness.

![Qwik](https://img.shields.io/badge/Qwik-2.0-blue?style=flat-square&logo=qwik)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

| Feature                   | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| 📝 **Editable Invoice**   | Toggle between edit and preview modes                     |
| 🖼️ **Logo Upload**        | Add your company logo (stored as base64, embedded in PDF) |
| 📋 **Dynamic Line Items** | Add, edit, and remove billable items                      |
| 💰 **Auto Calculations**  | Subtotal, tax, and total calculated automatically         |
| 📄 **PDF Export**         | Download professional PDF invoices                        |
| 📧 **Send Invoice**       | Simulated email sending (ready for API integration)       |
| 🎨 **Tailwind Styling**   | Clean, responsive design with Tailwind CSS                |
| ⚡ **Instant Loading**    | Qwik's resumability for zero-JS initial load              |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or [Deno](https://deno.land/) v2+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd invo

# Install dependencies (choose one)
npm install
# or
deno install
```

### Development

```bash
# Start development server
npm run dev
# or
deno task start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
invo/
├── public/
│   └── manifest.json         # PWA manifest
├── src/
│   ├── components/
│   │   ├── invoice/
│   │   │   ├── AddressSection.tsx   # Reusable address form
│   │   │   ├── InvoiceHeader.tsx    # Header with logo & dates
│   │   │   └── LineItems.tsx        # Billable items table
│   │   └── router-head/
│   │       └── router-head.tsx      # SEO & meta tags
│   ├── routes/
│   │   └── index.tsx                # Main invoice page
│   ├── types/
│   │   └── invoice.ts               # TypeScript interfaces
│   ├── utils/
│   │   └── pdfGenerator.ts          # PDF generation utility
│   ├── entry.dev.tsx                # Dev entry point
│   ├── entry.preview.tsx            # Preview server entry
│   ├── entry.ssr.tsx                # SSR entry point
│   ├── global.css                   # Tailwind imports
│   └── root.tsx                     # Root component
├── eslint.config.js                 # ESLint configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── package.json                     # Dependencies & scripts
```

---

## 🛠️ Tech Stack

| Technology                                                           | Purpose                        |
| -------------------------------------------------------------------- | ------------------------------ |
| [Qwik](https://qwik.dev/)                                            | UI framework with resumability |
| [QwikCity](https://qwik.dev/docs/qwikcity/)                          | File-based routing & SSR       |
| [TypeScript](https://www.typescriptlang.org/)                        | Type safety                    |
| [Tailwind CSS](https://tailwindcss.com/)                             | Utility-first styling          |
| [Vite](https://vitejs.dev/)                                          | Build tool & dev server        |
| [jsPDF](https://github.com/parallax/jsPDF)                           | PDF generation                 |
| [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Table formatting in PDFs       |

---

## 📖 Usage Guide

### Creating an Invoice

1. **Edit Mode** (default): Fill in all invoice details
2. **Add Logo**: Click "Add Logo" and select an image file
3. **Add Items**: Click "Add Line Item" to add billable services
4. **Set Tax Rate**: Modify the tax percentage as needed
5. **Preview**: Click "Preview Mode" to see the final invoice
6. **Download**: Click "Download PDF" to save as PDF
7. **Send**: Click "Send Invoice" to simulate sending

### Invoice Fields

| Field      | Description                             |
| ---------- | --------------------------------------- |
| Invoice #  | Unique identifier (auto-generated)      |
| Date       | Invoice creation date                   |
| Due Date   | Payment due date                        |
| Bill From  | Your company details                    |
| Bill To    | Client details                          |
| Line Items | Services/products with quantity & price |
| Tax Rate   | Percentage applied to subtotal          |
| Notes      | Payment terms or additional info        |

---

## 🧩 Key Qwik Concepts Used

This project demonstrates several Qwik patterns:

### State Management

```tsx
// Simple values
const isEditing = useSignal(true);

// Complex objects
const invoice = useStore<Invoice>({ ... });
```

### Event Handlers

```tsx
// Lazy-loadable handlers with $
const handleSave$ = $(() => {
  // This code is only loaded when triggered
});
```

### Component Props with QRL

```tsx
interface Props {
  onDelete$: QRL<() => void>; // Lazy-loadable callback
}
```

### Conditional Rendering

```tsx
{isEditing ? (
  <input value={data} onInput$={...} />
) : (
  <span>{data}</span>
)}
```

---

## 📝 Educational Comments

All source files include comprehensive comments explaining:

- **Qwik concepts** (component$, $, useStore, useSignal)
- **QwikCity features** (routing, SSR, document head)
- **TypeScript patterns** (interfaces, generics, QRL types)
- **Code architecture** (why decisions were made)

Perfect for developers learning Qwik!

---

## 🔧 Configuration Files

| File                 | Purpose                               |
| -------------------- | ------------------------------------- |
| `vite.config.ts`     | Build configuration with Qwik plugins |
| `tsconfig.json`      | TypeScript compiler options           |
| `tailwind.config.js` | Tailwind content paths & theme        |
| `eslint.config.js`   | Linting rules (flat config)           |
| `prettier.config.js` | Code formatting with Tailwind plugin  |
| `deno.json`          | Deno runtime configuration            |

---

## 🚢 Deployment

Add a deployment adapter using:

```bash
npm run qwik add
```

Available adapters:

- Cloudflare Pages
- Netlify
- Vercel
- Node.js Express
- Static Site Generation (SSG)

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🔗 Resources

- [Qwik Documentation](https://qwik.dev/)
- [QwikCity Routing](https://qwik.dev/docs/qwikcity/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [jsPDF Documentation](https://rawgit.com/MrRio/jsPDF/master/docs/)

---

Built with ⚡ by Qwik
