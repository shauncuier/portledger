You are a senior full-stack engineer building a production-ready financial management system for a Clearing & Forwarding (C&F) business.

The system must manage income, expenses, invoices, clients, reports, and users with accuracy, security, scalability, and clean architecture.

This is NOT a demo or pilot.
It must be suitable for daily business operations.

Tech Stack (MANDATORY)

Framework: Next.js (App Router)

Language: TypeScript

Frontend: React (Server + Client Components)

Backend: Next.js API Routes + Server Actions

Database: MongoDB (Mongoose ODM)

Auth: NextAuth (JWT-based)

Validation: Zod

Styling: Tailwind CSS

Charts: Recharts or Chart.js

Hosting Target: Vercel + MongoDB Atlas

Application Identity

App Name: ClearLedger

App Slug: clearledger (lowercase everywhere)

Environment: dev / staging / production

Core Functional Modules (REQUIRED)
1️⃣ Authentication & Authorization

Secure login (email + password)

Role-based access control (RBAC)

Roles:

Owner – full access

Accountant – financial access

Staff – limited data entry

Middleware-protected routes

Session + JWT strategy

Logout & session expiry

2️⃣ User Management

Create / edit / deactivate users

Assign roles

Password hashing

Audit trail for user actions

3️⃣ Client Management

CRUD operations

Fields:

name

company_name

phone

email

address

opening_balance

status (active/inactive)

Client-wise financial summary

4️⃣ Invoice Management (CRITICAL)

Auto-generated invoice numbers

Invoice status:

unpaid

partial

paid

Invoice fields:

client_id

invoice_date

due_date

items[] (description, qty, rate)

subtotal

tax / VAT (optional)

discount (optional)

total

PDF invoice generation

Invoice edit restrictions after payment

Soft delete only (no hard deletes)

5️⃣ Income Management

Linked to invoices

Multiple payments per invoice

Fields:

invoice_id

client_id

amount

payment_method (cash/bank/mobile)

received_date

reference

Auto-update invoice status

Prevent overpayment

6️⃣ Expense Management

Expense categories:

Port

Customs

Transport

Labour

Office

Misc

Fields:

category

vendor_name

amount

payment_method

expense_date

note

Expense approval status (optional)

7️⃣ Reporting Engine (VERY IMPORTANT)

Use MongoDB aggregation pipelines.

Reports required:

Daily income report

Monthly income report

Expense summary

Profit & Loss

Client-wise statement

Outstanding receivables

Date range filters

Export to PDF & Excel

8️⃣ Dashboard

KPI cards:

Total income (month)

Total expense (month)

Net profit

Outstanding dues

Charts:

Income vs Expense

Monthly trend

Real-time updates

Database Design Rules

Mongoose schemas with indexes

Soft delete (deletedAt)

Timestamps

UUID or ObjectId consistency

No duplicate financial data

Service-layer validation

Folder Structure (MANDATORY)
/app
  /(auth)/login
  /(dashboard)/dashboard
  /(dashboard)/clients
  /(dashboard)/invoices
  /(dashboard)/income
  /(dashboard)/expenses
  /(dashboard)/reports
  /api
    /auth
    /clients
    /users
    /invoices
    /income
    /expenses
    /reports

/lib
  db.ts
  auth.ts
  permissions.ts

/models
  User.ts
  Client.ts
  Invoice.ts
  Income.ts
  Expense.ts

/services
  invoice.service.ts
  income.service.ts
  expense.service.ts
  report.service.ts

/validators
  invoice.schema.ts
  income.schema.ts
  expense.schema.ts

/middleware.ts

Security Requirements

Server-only DB access

Zod validation on every API

Role-based authorization checks

Rate limiting

CSRF protection

Environment variable protection

Activity logs for edits & deletes

Performance & Scalability

MongoDB indexes for reports

Aggregation optimization

Server Components for reports

Stateless APIs

Ready for multi-branch expansion

Business Rules (STRICT)

Income must always link to an invoice

Invoice totals must be immutable after payment

No negative balances

Expense deletion requires admin

Financial data must never be hard deleted

Output Expectations

Generate:

MongoDB schemas

API routes

Services with business logic

Role middleware

Dashboard pages

Reporting aggregation logic

Secure authentication flow

Production-ready code only

Coding Style

Clean, modular, readable

No shortcuts

No demo logic

Comments only where necessary

Production-quality error handling

Final Instruction

Build this system as if it will be used daily by a real C&F company handling real money.
Accuracy, security, and maintainability are more important than speed.