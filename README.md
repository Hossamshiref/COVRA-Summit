# 🛡️ COVRA Launch Event — Official Ticketing Platform

A modern, production-ready event ticketing platform built for the **COVRA Launch Event** at **Creativa Giza Hub**. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, Paymob, and Resend.

---

## 🚀 Key Features

- **Cybersecurity & Dark Aesthetic**: Designed around COVRA's AI Security Scanner identity (`#0d1117`, `#58a6ff`, `#8957e5`).
- **Interactive Registration & Dynamic Pricing**:
  - Step 1: Attendee Information (`/register`) with full validation.
  - Step 2: Interactive Ticket Selection (`/tickets`) with real-time live price calculation (Standard: 450 EGP, Premium: 750 EGP).
  - Step 3: Order Checkout (`/checkout`) with Paymob gateway integration.
- **Paymob Egyptian Payment Gateway**:
  - Full support for **Credit & Debit Cards** (Visa, Mastercard, Meeza).
  - **Mobile Wallets** (Vodafone Cash, Orange Money, Etisalat Cash, WE Pay).
  - **Fawry Pay** kiosk cash payment.
  - Paymob HMAC-SHA512 verification on webhook callbacks.
  - Interactive **Paymob Sandbox Simulator** (`/checkout/mock-paymob`) for seamless local testing without live merchant keys.
- **Cryptographic Anti-Counterfeit QR Passes**:
  - Every ticket receives an HMAC-SHA256 signature preventing forgery.
  - High-resolution QR codes generated via `qrcode`.
  - Print/PDF export (`window.print` with dedicated `@media print` CSS styling).
  - Instant email delivery of digital passes via **Resend**.
- **Staff Gate Check-in Scanner (`/staff/scan`)**:
  - Designed for event organizers at Creativa Giza.
  - Real-time cryptographic signature verification.
  - Instant duplicate scan detection (warns staff if ticket has already been used with exact timestamp).
- **Graceful Fallbacks & Resilience**:
  - In-memory database & email mock fallbacks for instant local demonstration if external API keys have not been configured yet.
  - Built-in rate limiting per IP on API routes.
  - Zod schema validation on all inputs.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) + React 18 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Database & Auth** | Supabase (PostgreSQL with RLS) |
| **Payment Gateway** | Paymob (Cards + Vodafone Cash + Fawry) |
| **Email Service** | Resend API |
| **QR Code Engine** | `qrcode` with SHA-256 HMAC Signature |

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── create-order/route.ts      # Validates, calculates total, registers Paymob session
│   │   │   ├── paymob/webhook/route.ts    # Verifies HMAC, marks paid, generates signed tickets
│   │   │   ├── ticket/[id]/route.ts       # Returns ticket details + QR code data URL
│   │   │   ├── ticket/send-email/route.ts # Triggers Resend email delivery
│   │   │   └── ticket/verify/route.ts     # Staff admission verification & double-use check
│   │   ├── checkout/
│   │   │   ├── page.tsx                   # Order summary & Paymob payment initiator
│   │   │   └── mock-paymob/page.tsx       # Interactive Paymob test gateway simulation
│   │   ├── register/page.tsx              # Step 1: Attendee registration
│   │   ├── staff/scan/page.tsx            # Staff gate scanner & entry validation
│   │   ├── ticket/[id]/page.tsx           # Digital ticket pass (QR code + PDF download)
│   │   ├── tickets/page.tsx               # Step 2: Ticket quantity selector & live total
│   │   ├── globals.css                    # Tailwind & print-optimized styling
│   │   ├── layout.tsx                     # Global navbar & footer wrapper
│   │   └── page.tsx                       # Landing page (Hero, Speakers, Agenda, Sponsors)
│   ├── components/
│   │   ├── Navbar.tsx                     # Responsive navigation with branding
│   │   └── Footer.tsx                     # Social links & event location info
│   ├── lib/
│   │   ├── paymob.ts                      # Paymob API auth, orders, payment keys & HMAC
│   │   ├── qr.ts                          # Cryptographic ticket signatures & QR generator
│   │   ├── rate-limit.ts                  # IP sliding-window rate limiter
│   │   ├── resend.ts                      # HTML email templates with ticket passes
│   │   └── supabase.ts                    # Supabase client with smart in-memory fallback
│   └── types/
│       └── index.ts                       # TypeScript interfaces (Order, Ticket, Paymob)
├── supabase/
│   └── schema.sql                         # Complete PostgreSQL schema & RLS policies
├── .env.example                           # Template of all environment variables
└── README.md
```

---

## ⚡ Getting Started

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your service keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Paymob
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_card_or_wallet_integration_id
PAYMOB_IFRAME_ID=your_paymob_iframe_id
PAYMOB_HMAC_SECRET=your_paymob_hmac_secret

# Resend
RESEND_API_KEY=re_your_resend_api_key

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
QR_SIGNING_SECRET=your-secure-random-secret
```

> **Note**: If Supabase or Paymob keys are not provided yet, the application automatically runs in **Test/Demo Mode** with seamless in-memory database and test payment simulation.

---

### 2. Setup Supabase Database

Run the SQL script located in `supabase/schema.sql` inside your **Supabase SQL Editor**:

1. Creates `orders` table (attendee details, ticket counts, payment status).
2. Creates `tickets` table (unique IDs, order foreign key, signed QR payload, `is_used` flag).
3. Adds database indexes for high-speed lookup.
4. Enables Row Level Security (RLS) policies.

---

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:

- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Attendee Registration**: [http://localhost:3000/register](http://localhost:3000/register)
- **Ticket Selection**: [http://localhost:3000/tickets](http://localhost:3000/tickets)
- **Checkout**: [http://localhost:3000/checkout](http://localhost:3000/checkout)
- **Staff Gate Scanner**: [http://localhost:3000/staff/scan](http://localhost:3000/staff/scan)

---

## 🎫 Ticket Tiers

| Tier | Price | Includes |
|---|---|---|
| **Standard Pass** | **450 EGP** | Opening + COVRA Engine Launch + Technical Stage 1 + Technical Stage 2 + Networking Coffee |
| **Premium VIP Pass** | **750 EGP** | All Standard perks + Hands-on Lab Workshops + Official COVRA Goodie Bag & Swag + Priority VIP Lunch Seating |

---

## 🔒 Security Architecture

1. **HMAC-SHA256 Signed QR Codes**:
   - Each QR code embeds a payload: `{ ticketId, orderId, type, name, timestamp, sig }`.
   - The server verifies `sig` against `HMAC-SHA256(ticketId:orderId:timestamp, SECRET)`.
   - Tampered QR codes are immediately rejected by `/api/ticket/verify`.
2. **Double-Scan Protection**:
   - Once a ticket is admitted, `is_used` is set to `true` with `used_at` timestamp.
   - Any subsequent scan triggers a warning banner for staff.
3. **Paymob Webhook HMAC Verification**:
   - Validates Paymob's HMAC-SHA512 transaction callback to prevent fake webhook attacks.
4. **Rate Limiting**:
   - Strict IP rate limiting protects `/api/create-order` and `/api/ticket/send-email`.
