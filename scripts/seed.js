const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // ============ SCHEMAS ============
    const UserSchema = new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, enum: ['owner', 'accountant', 'staff'], default: 'staff' },
        status: { type: String, default: 'active' },
        deletedAt: { type: Date, default: null },
    }, { timestamps: true });

    const ClientSchema = new mongoose.Schema({
        name: String,
        company_name: String,
        phone: String,
        email: String,
        address: String,
        opening_balance: { type: Number, default: 0 },
        status: { type: String, default: 'active' },
        deletedAt: { type: Date, default: null },
    }, { timestamps: true });

    const InvoiceSchema = new mongoose.Schema({
        invoice_number: { type: String, unique: true },
        client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        invoice_date: Date,
        due_date: Date,
        items: [{
            description: String,
            qty: Number,
            rate: Number,
            amount: Number,
        }],
        subtotal: Number,
        tax: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: Number,
        paid_amount: { type: Number, default: 0 },
        status: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
        deletedAt: { type: Date, default: null },
    }, { timestamps: true });

    const IncomeSchema = new mongoose.Schema({
        invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
        client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        amount: Number,
        payment_method: { type: String, enum: ['cash', 'bank', 'mobile'] },
        received_date: Date,
        reference: String,
        deletedAt: { type: Date, default: null },
    }, { timestamps: true });

    const ExpenseSchema = new mongoose.Schema({
        category: { type: String, enum: ['Port', 'Customs', 'Transport', 'Labour', 'Office', 'Misc'] },
        vendor_name: String,
        amount: Number,
        payment_method: String,
        expense_date: Date,
        note: String,
        deletedAt: { type: Date, default: null },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
    const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
    const Income = mongoose.models.Income || mongoose.model('Income', IncomeSchema);
    const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

    // ============ SEED USERS ============
    console.log('\n📦 Seeding Users...');
    const users = [
        { name: 'System Owner', email: 'admin@clearledger.com', password: 'admin123', role: 'owner' },
        { name: 'John Accountant', email: 'accountant@clearledger.com', password: 'account123', role: 'accountant' },
        { name: 'Jane Staff', email: 'staff@clearledger.com', password: 'staff123', role: 'staff' },
    ];

    for (const user of users) {
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({ ...user, password: hashedPassword, status: 'active' });
            console.log(`   ✓ Created user: ${user.email}`);
        } else {
            console.log(`   - User exists: ${user.email}`);
        }
    }

    // ============ SEED CLIENTS ============
    console.log('\n📦 Seeding Clients...');
    const clients = [
        { name: 'Ahmed Rahman', company_name: 'Rahman Imports Ltd', phone: '+8801711111111', email: 'ahmed@rahmanimports.com', address: '123 Banani, Dhaka', opening_balance: 5000 },
        { name: 'Sarah Chen', company_name: 'Chen Trading Co.', phone: '+8801722222222', email: 'sarah@chentrading.com', address: '456 Gulshan, Dhaka', opening_balance: 12000 },
        { name: 'Mohammad Ali', company_name: 'Ali Shipping Solutions', phone: '+8801733333333', email: 'ali@alishipping.com', address: '789 Motijheel, Dhaka', opening_balance: 0 },
        { name: 'Fatima Begum', company_name: 'Begum Exports', phone: '+8801744444444', email: 'fatima@begumexports.com', address: '321 Dhanmondi, Dhaka', opening_balance: 8500 },
        { name: 'Karim Hassan', company_name: 'Hassan Logistics', phone: '+8801755555555', email: 'karim@hassanlogistics.com', address: '654 Uttara, Dhaka', opening_balance: 3200 },
    ];

    const createdClients = [];
    for (const client of clients) {
        let existing = await Client.findOne({ email: client.email });
        if (!existing) {
            existing = await Client.create({ ...client, status: 'active' });
            console.log(`   ✓ Created client: ${client.company_name}`);
        } else {
            console.log(`   - Client exists: ${client.company_name}`);
        }
        createdClients.push(existing);
    }

    // ============ SEED INVOICES ============
    console.log('\n📦 Seeding Invoices...');
    const invoiceData = [
        {
            client: createdClients[0],
            invoice_number: 'INV-00001',
            items: [
                { description: 'Customs Clearance Fee', qty: 1, rate: 15000, amount: 15000 },
                { description: 'Documentation Charges', qty: 1, rate: 2500, amount: 2500 },
            ],
            status: 'paid',
            paid_amount: 17500,
        },
        {
            client: createdClients[1],
            invoice_number: 'INV-00002',
            items: [
                { description: 'Port Handling Charges', qty: 2, rate: 8000, amount: 16000 },
                { description: 'Transport to Warehouse', qty: 1, rate: 5000, amount: 5000 },
                { description: 'Insurance Fee', qty: 1, rate: 3000, amount: 3000 },
            ],
            status: 'partial',
            paid_amount: 15000,
        },
        {
            client: createdClients[2],
            invoice_number: 'INV-00003',
            items: [
                { description: 'Full Container Load Clearance', qty: 1, rate: 45000, amount: 45000 },
            ],
            status: 'unpaid',
            paid_amount: 0,
        },
        {
            client: createdClients[3],
            invoice_number: 'INV-00004',
            items: [
                { description: 'Air Cargo Handling', qty: 1, rate: 25000, amount: 25000 },
                { description: 'Customs Duty Payment', qty: 1, rate: 12000, amount: 12000 },
            ],
            status: 'paid',
            paid_amount: 37000,
        },
        {
            client: createdClients[4],
            invoice_number: 'INV-00005',
            items: [
                { description: 'LCL Shipment Processing', qty: 3, rate: 6000, amount: 18000 },
                { description: 'Warehouse Storage (7 days)', qty: 1, rate: 4500, amount: 4500 },
            ],
            status: 'unpaid',
            paid_amount: 0,
        },
    ];

    const createdInvoices = [];
    for (const inv of invoiceData) {
        const exists = await Invoice.findOne({ invoice_number: inv.invoice_number });
        if (!exists) {
            const subtotal = inv.items.reduce((sum, item) => sum + item.amount, 0);
            const invoice = await Invoice.create({
                invoice_number: inv.invoice_number,
                client_id: inv.client._id,
                invoice_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                items: inv.items,
                subtotal,
                tax: 0,
                discount: 0,
                total: subtotal,
                paid_amount: inv.paid_amount,
                status: inv.status,
            });
            createdInvoices.push(invoice);
            console.log(`   ✓ Created invoice: ${inv.invoice_number} (${inv.status})`);
        } else {
            createdInvoices.push(exists);
            console.log(`   - Invoice exists: ${inv.invoice_number}`);
        }
    }

    // ============ SEED INCOME ============
    console.log('\n📦 Seeding Income Records...');
    const incomeData = [
        { invoice: createdInvoices[0], amount: 17500, method: 'bank', ref: 'TXN-001' },
        { invoice: createdInvoices[1], amount: 15000, method: 'cash', ref: 'CASH-001' },
        { invoice: createdInvoices[3], amount: 37000, method: 'mobile', ref: 'BKASH-001' },
    ];

    for (const inc of incomeData) {
        if (inc.invoice) {
            const exists = await Income.findOne({ invoice_id: inc.invoice._id });
            if (!exists) {
                await Income.create({
                    invoice_id: inc.invoice._id,
                    client_id: inc.invoice.client_id,
                    amount: inc.amount,
                    payment_method: inc.method,
                    received_date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
                    reference: inc.ref,
                });
                console.log(`   ✓ Created income: $${inc.amount} via ${inc.method}`);
            } else {
                console.log(`   - Income exists for invoice: ${inc.invoice.invoice_number}`);
            }
        }
    }

    // ============ SEED EXPENSES ============
    console.log('\n📦 Seeding Expenses...');
    const expenses = [
        { category: 'Port', vendor_name: 'Chittagong Port Authority', amount: 12000, payment_method: 'bank', note: 'Monthly port charges' },
        { category: 'Customs', vendor_name: 'NBR Customs', amount: 8500, payment_method: 'bank', note: 'Duty payment for client shipment' },
        { category: 'Transport', vendor_name: 'Fast Track Logistics', amount: 6500, payment_method: 'cash', note: 'Container transport' },
        { category: 'Labour', vendor_name: 'Loading Crew', amount: 3500, payment_method: 'cash', note: 'Unloading 2 containers' },
        { category: 'Office', vendor_name: 'Dhaka Electric Supply', amount: 4200, payment_method: 'bank', note: 'Monthly electricity bill' },
        { category: 'Office', vendor_name: 'Office Rent', amount: 25000, payment_method: 'bank', note: 'January 2026 rent' },
        { category: 'Misc', vendor_name: 'Stationery Shop', amount: 1500, payment_method: 'cash', note: 'Office supplies' },
        { category: 'Transport', vendor_name: 'Fuel Station', amount: 8000, payment_method: 'cash', note: 'Vehicle fuel for January' },
    ];

    for (const exp of expenses) {
        const exists = await Expense.findOne({ vendor_name: exp.vendor_name, amount: exp.amount });
        if (!exists) {
            await Expense.create({
                ...exp,
                expense_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            });
            console.log(`   ✓ Created expense: ${exp.category} - $${exp.amount}`);
        } else {
            console.log(`   - Expense exists: ${exp.vendor_name}`);
        }
    }

    console.log('\n✅ Seeding complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  TEST CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Owner:      admin@clearledger.com / admin123');
    console.log('  Accountant: accountant@clearledger.com / account123');
    console.log('  Staff:      staff@clearledger.com / staff123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
}

seed().catch(console.error);
