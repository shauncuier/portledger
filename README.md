# ClearLedger

**Production-Ready Financial Management System for Clearing & Forwarding Businesses**

A comprehensive, secure, and scalable financial management system built with Next.js 16, MongoDB, and TypeScript. Designed for daily business operations handling real money with accuracy, security, and maintainability.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Authentication | NextAuth.js (JWT) |
| Validation | Zod |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file based on `.env.example`:
```env
MONGODB_URI=mongodb+srv://your_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_at_least_32_characters
```

### 3. Seed the Database
Run the seed script to create the initial owner account:
```bash
node scripts/seed.js
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Test User Accounts

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Owner** | `admin@clearledger.com` | `admin123` | Full system access, user management |
| **Accountant** | `accountant@clearledger.com` | `account123` | Financial operations, reports |
| **Staff** | `staff@clearledger.com` | `staff123` | Data entry (clients, invoices) |

> ⚠️ **Note**: Only the Owner account is created by the seed script. You can create Accountant and Staff accounts from the User Management section after logging in as Owner.

---

## 📁 Project Structure

```
clearledger/
├── app/
│   ├── (auth)/login/           # Authentication pages
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/          # Main dashboard
│   │   ├── clients/            # Client management
│   │   ├── invoices/           # Invoice management
│   │   ├── income/             # Income tracking
│   │   ├── expenses/           # Expense tracking
│   │   └── reports/            # Financial reports
│   ├── api/                    # API routes
│   │   ├── auth/[...nextauth]/ # NextAuth endpoints
│   │   ├── clients/            # Client CRUD
│   │   ├── invoices/           # Invoice CRUD
│   │   ├── income/             # Income CRUD
│   │   ├── expenses/           # Expense CRUD
│   │   ├── reports/            # Report generation
│   │   └── users/              # User management
│   └── components/             # React components
├── lib/
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # NextAuth configuration
│   ├── auth-utils.ts           # Authorization helpers
│   ├── permissions.ts          # RBAC utilities
│   └── utils.ts                # Common utilities
├── models/                     # Mongoose schemas
│   ├── User.ts
│   ├── Client.ts
│   ├── Invoice.ts
│   ├── Income.ts
│   └── Expense.ts
├── services/                   # Business logic layer
│   ├── client.service.ts
│   ├── invoice.service.ts
│   ├── income.service.ts
│   ├── expense.service.ts
│   ├── report.service.ts
│   └── user.service.ts
├── validators/                 # Zod schemas
│   ├── client.schema.ts
│   ├── invoice.schema.ts
│   ├── income.schema.ts
│   └── expense.schema.ts
├── proxy.ts                    # Next.js 16 request proxy
└── scripts/
    └── seed.js                 # Database seeding script
```

---

## 🔒 Security Features

- **JWT-based Authentication** via NextAuth.js
- **Role-Based Access Control (RBAC)** with Owner, Accountant, and Staff roles
- **Server-side Authorization** in API routes (not just proxy)
- **Zod Validation** on all API endpoints
- **Soft Delete** for all financial records (audit trail)
- **Password Hashing** with bcrypt

---

## 📊 Core Modules

### Dashboard
- KPI cards (Income, Expense, Profit, Outstanding)
- Income vs Expense chart
- Top outstanding receivables

### Client Management
- Full CRUD operations
- Client-wise financial summary
- Status tracking (active/inactive)

### Invoice Management
- Auto-generated invoice numbers (INV-00001)
- Line items with quantity and rate
- Tax and discount support
- Status tracking (Unpaid → Partial → Paid)
- Immutable after payment (business rule)

### Income Tracking
- Linked to invoices (mandatory)
- Multiple payments per invoice
- Auto-update invoice status
- Overpayment prevention

### Expense Tracking
- Categorized expenses (Port, Customs, Transport, Labour, Office, Misc)
- Vendor tracking
- Payment method recording

### Reports
- Profit & Loss Statement
- Outstanding Receivables
- Monthly Income/Expense Trends
- Client Statements

---

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `node scripts/seed.js` | Seed initial owner account |

---

## 📄 License

This project is proprietary software built for C&F business operations.

---

## 👤 Author

Built with precision for real-world financial operations.
