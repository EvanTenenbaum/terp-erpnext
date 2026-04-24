# TERP Numbers-Style Design Specification

---

## 1. Information Architecture Tree

```
TERP ERP (Root)
├── [Global Chrome]
│   ├── CommandPalette (Cmd+K)
│   ├── NotificationBell (6 notification types)
│   ├── UserMenu (Role switcher, logout)
│   └── SheetTabBar (7 sheets + VIP Portal + Shared Sales Sheet)
│
├── SHEET 1: Sales (accent: #E8F5E9 sage)
│   ├── TABLE: Sales Order
│   │   ├── View: Table (default) — columns: SO#, Customer, Status, Total, Credit Status, Pricing Profile, Source, Created
│   │   ├── View: Kanban — by status (Draft → Submitted → Ordered → Fulfilled → Invoiced)
│   │   ├── View: Calendar — by expected delivery date
│   │   ├── View: Form — full Sales Order form overlay
│   │   ├── Modal: NewSalesOrderQuickEntry
│   │   ├── Modal: PricingInspector (shows COGS × markup math, applied rules)
│   │   ├── Modal: CreditCheckBanner (inline warning/block indicator)
│   │   └── Inspector Panel: Order details, line items, linked Invoice, Payment status
│   │
│   ├── TABLE: Quotation
│   │   ├── View: Table (default) — columns: Q#, Customer, Valid Until, Total, Status
│   │   ├── View: Form
│   │   ├── Modal: ConvertToSalesOrder
│   │   └── Inspector Panel: Quote details, convert action, expiry warning
│   │
│   ├── TABLE: Sales Return
│   │   ├── View: Table (default) — columns: Return#, Original SO, Customer, Reason, Status, Amount
│   │   ├── View: Form
│   │   └── Inspector Panel: Return details, linked original order, restock status
│   │
│   ├── TABLE: Sales Catalogue
│   │   ├── View: Table (default) — columns: Catalogue#, Name, Items Count, Share Token, Created By, Status
│   │   ├── View: Grid (visual product grid)
│   │   ├── Modal: CreateCatalogue
│   │   ├── Modal: GenerateShareToken
│   │   ├── Modal: ConvertToOrder
│   │   ├── Modal: ConvertToQuotation
│   │   └── Inspector Panel: Catalogue items list, share URL, conversion history
│   │
│   ├── TABLE: Sales Catalogue Item (child table, accessed via Sales Catalogue Inspector)
│   │
│   ├── TABLE: Live Shopping Session
│   │   ├── View: Table (default) — columns: Session#, Host, Status, Participants, Items, Start Time
│   │   ├── View: Kanban — by status (Scheduled → Live → Paused → Ended)
│   │   ├── Modal: StartSession
│   │   ├── Modal: PauseSession
│   │   ├── Modal: EndSession
│   │   ├── Modal: MarkInterest (participant action)
│   │   ├── Modal: ConvertInterestToOrder
│   │   └── Inspector Panel: Participants list, items shown, interest log, conversion stats
│   │
│   ├── TABLE: Live Shopping Item (child table, accessed via Live Shopping Session Inspector)
│   │
│   ├── TABLE: Live Shopping Participant (child table, accessed via Live Shopping Session Inspector)
│   │
│   ├── TABLE: Client Need
│   │   ├── View: Table (default) — columns: Need#, Customer, Strain/Type, Quantity, Price Range, Status, Match Count
│   │   ├── View: Form
│   │   ├── Modal: FindMatches (triggers matchmaking_service)
│   │   └── Inspector Panel: Need details, matched Supplier Supply records, match scores
│   │
│   ├── TABLE: Supplier Supply
│   │   ├── View: Table (default) — columns: Supply#, Supplier, Strain/Type, Qty Available, Price Range, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Supply details, matched Client Needs, match scores
│   │
│   ├── TABLE: Match Record
│   │   ├── View: Table (default) — columns: Match#, Client Need, Supplier Supply, Score, Status, Created
│   │   ├── View: Form
│   │   ├── Modal: MatchRecordDetail (side-by-side comparison)
│   │   └── Inspector Panel: Score breakdown, conversion status, notes
│   │
│   ├── TABLE: Pricing Profile
│   │   ├── View: Table (default) — columns: Profile#, Name, Base Markup %, Rules Count, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Profile rules list, applied-to customers/orders
│   │
│   ├── TABLE: Pricing Profile Rule (child table, accessed via Pricing Profile Inspector)
│   │
│   └── TABLE: COGS Rule
│       ├── View: Table (default) — columns: Rule#, Item Group, Product Type, COGS Basis, Effective Date
│       ├── View: Form
│       └── Inspector Panel: Rule details, affected items preview
│
├── SHEET 2: Inventory (accent: #E3F2FD sky)
│   ├── TABLE: Batch
│   │   ├── View: Table (default) — columns: SKU, Item, Batch Status, Supplier, Lot#, Qty, Unit Cost, Photography Status, Intake Session
│   │   ├── View: Kanban — by batch_status (Intake → Photography → Ready → Live → Sold → Depleted)
│   │   ├── View: Form
│   │   ├── Modal: UpdateBatchStatus (drag-drop or manual)
│   │   └── Inspector Panel: Batch details, status history, linked Intake Session, photography images
│   │
│   ├── TABLE: Batch Status History
│   │   ├── View: Table (default) — columns: Batch, From Status, To Status, Changed By, Timestamp, Notes
│   │   └── Inspector Panel: Full history timeline for selected batch
│   │
│   ├── TABLE: Intake Session
│   │   ├── View: Table (default) — columns: Session#, Supplier, Date, Batches Count, Status, Intake By
│   │   ├── View: Form
│   │   ├── Modal: NewIntakeSession (multi-batch entry wizard)
│   │   └── Inspector Panel: Session batches list, supplier info, intake checklist
│   │
│   ├── TABLE: Intake Session Batch (child table, accessed via Intake Session Inspector)
│   │
│   ├── TABLE: Stock Entry
│   │   ├── View: Table (default) — columns: Entry#, Type, From Warehouse, To Warehouse, Items Count, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Entry items, linked documents
│   │
│   ├── TABLE: Delivery Note
│   │   ├── View: Table (default) — columns: DN#, Customer, Sales Order, Status, Delivery Date, Items Count
│   │   ├── View: Kanban — by status (Draft → To Deliver → Delivered)
│   │   ├── View: Calendar — by delivery date
│   │   ├── View: Form
│   │   └── Inspector Panel: Items list, tracking info, POD
│   │
│   ├── TABLE: Photography Queue
│   │   ├── View: Table (default) — columns: Queue#, Batch, Priority, Status, Assigned To, Due Date
│   │   ├── View: Kanban — by status (Pending → In Progress → Review → Complete)
│   │   ├── View: Form
│   │   └── Inspector Panel: Images list, batch details, approval status
│   │
│   ├── TABLE: Photography Queue Image (child table, accessed via Photography Queue Inspector)
│   │
│   ├── TABLE: Sample Request
│   │   ├── View: Table (default) — columns: Request#, Customer, Batch, Qty, Status, Return Due
│   │   ├── View: Kanban — by status (Requested → Approved → Sent → Returned → Converted)
│   │   ├── View: Calendar — by return due date
│   │   ├── View: Form
│   │   └── Inspector Panel: Sample details, return tracking, conversion to order
│   │
│   ├── TABLE: Workflow Queue Status
│   │   ├── View: Table (default) — columns: Queue#, Batch, Current Step, Next Step, Assigned, Due
│   │   └── Inspector Panel: Workflow history, blockers
│   │
│   ├── TABLE: Warehouse
│   │   ├── View: Table (default) — columns: Warehouse, Type, Parent, Is Group, Stock Value
│   │   ├── View: Form
│   │   └── Inspector Panel: Warehouse details, stock summary
│   │
│   ├── TABLE: Stock Ledger Entry (read-only)
│   │   ├── View: Table (default) — columns: Entry#, Item, Batch, Warehouse, Qty Change, Balance, Posting Date
│   │   └── Inspector Panel: Entry details, linked voucher
│   │
│   ├── TABLE: Item (ERPNext builtin + custom fields)
│   │   ├── View: Table (default) — columns: Item Code, Name, Strain, Product Grade, Product Type, COGS Mode, Workflow Status, Stock Qty
│   │   ├── View: Form
│   │   └── Inspector Panel: Full item details, custom fields panel, linked batches
│   │
│   ├── TABLE: THCA Strain
│   │   ├── View: Table (default) — columns: Strain Name, Type (Indica/Sativa/Hybrid), THC%, Terpene Profile, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Strain details, linked items/batches
│   │
│   └── TABLE: Product Grade
│       ├── View: Table (default) — columns: Grade Code, Name, Sort Order, Description
│       ├── View: Form
│       └── Inspector Panel: Grade details, linked items
│
├── SHEET 3: Procurement (accent: #FFF3E0 peach)
│   ├── TABLE: Purchase Order
│   │   ├── View: Table (default) — columns: PO#, Supplier, Status, Total, Expected Date, Items Count
│   │   ├── View: Kanban — by status (Draft → Ordered → Partial → Received → Billed)
│   │   ├── View: Calendar — by expected date
│   │   ├── View: Form
│   │   └── Inspector Panel: PO details, items, receipt status, payment status
│   │
│   ├── TABLE: Purchase Receipt
│   │   ├── View: Table (default) — columns: PR#, Supplier, PO Ref, Status, Receipt Date, Items Count
│   │   ├── View: Form
│   │   └── Inspector Panel: Receipt details, items, linked batches created
│   │
│   ├── TABLE: Supplier (ERPNext builtin + custom fields)
│   │   ├── View: Table (default) — columns: Supplier Name, License#, Harvest Reminder Days, Verification Email, Is Buyer, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Supplier details, open POs, supply records, harvest reminders
│   │
│   ├── TABLE: Supplier Supply (also in Sales)
│   │   ├── View: Table (default) — (same as Sales)
│   │   └── Inspector Panel: (same as Sales)
│   │
│   ├── TABLE: Supplier Harvest Reminder
│   │   ├── View: Table (default) — columns: Reminder#, Supplier, Next Harvest Date, Status, Last Contacted
│   │   ├── View: Calendar — by next harvest date
│   │   ├── View: Form
│   │   └── Inspector Panel: Reminder details, communication log
│   │
│   ├── TABLE: Purchase Invoice
│   │   ├── View: Table (default) — columns: PI#, Supplier, Status, Total, Due Date, Payment Status
│   │   ├── View: Kanban — by status (Draft → Submitted → Paid → Overdue)
│   │   ├── View: Form
│   │   └── Inspector Panel: Invoice details, linked PO/PR, payment entries
│   │
│   └── TABLE: Payment Entry (also in Finance)
│       ├── View: Table (default) — (same as Finance)
│       └── Inspector Panel: (same as Finance)
│
├── SHEET 4: Finance (accent: #F3E5F5 lavender)
│   ├── TABLE: Sales Invoice
│   │   ├── View: Table (default) — columns: SI#, Customer, Status, Total, Outstanding, Due Date, Days Overdue
│   │   ├── View: Kanban — by status (Draft → Submitted → Partially Paid → Paid → Overdue)
│   │   ├── View: Calendar — by due date
│   │   ├── View: Form
│   │   └── Inspector Panel: Invoice details, line items, payment entries, disputes
│   │
│   ├── TABLE: Payment Entry
│   │   ├── View: Table (default) — columns: PE#, Party Type, Party, Payment Type, Amount, Date, Mode
│   │   ├── View: Form
│   │   └── Inspector Panel: Payment details, linked invoices, reconciliation status
│   │
│   ├── TABLE: Invoice Dispute
│   │   ├── View: Table (default) — columns: Dispute#, Invoice, Customer, Reason, Amount Disputed, Status, Resolution
│   │   ├── View: Kanban — by status (Open → Under Review → Resolved → Closed)
│   │   ├── View: Form
│   │   └── Inspector Panel: Dispute details, communication log, resolution notes
│   │
│   ├── TABLE: Installment Payment
│   │   ├── View: Table (default) — columns: Installment#, Invoice, Customer, Total, Paid, Remaining, Next Due
│   │   ├── View: Calendar — by next due date
│   │   ├── View: Form
│   │   └── Inspector Panel: Schedule items, payment history
│   │
│   ├── TABLE: Installment Schedule Item (child table, accessed via Installment Payment Inspector)
│   │
│   ├── TABLE: Referral Credit
│   │   ├── View: Table (default) — columns: Credit#, Customer, Referred By, Amount, Status, Applied To
│   │   ├── View: Form
│   │   └── Inspector Panel: Credit details, linked orders
│   │
│   ├── TABLE: Crypto Payment
│   │   ├── View: Table (default) — columns: Payment#, Customer, Currency, Amount, USD Value, Tx Hash, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Payment details, blockchain verification, linked invoice
│   │
│   ├── TABLE: Transaction Fee
│   │   ├── View: Table (default) — columns: Fee#, Payment Entry, Fee Type, Amount, Status
│   │   └── Inspector Panel: Fee details, linked payment
│   │
│   ├── TABLE: Journal Entry
│   │   ├── View: Table (default) — columns: JE#, Entry Type, Total Debit, Total Credit, Posting Date, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Entry accounts, linked documents
│   │
│   ├── TABLE: GL Entry (read-only)
│   │   ├── View: Table (default) — columns: Entry#, Account, Debit, Credit, Posting Date, Voucher
│   │   └── Inspector Panel: Entry details
│   │
│   ├── TABLE: Account
│   │   ├── View: Table (default) — columns: Account Name, Account Number, Type, Balance, Is Group
│   │   ├── View: Tree — account hierarchy
│   │   ├── View: Form
│   │   └── Inspector Panel: Account details, GL entries summary
│   │
│   ├── TABLE: Bank Account
│   │   ├── View: Table (default) — columns: Account Name, Bank, Account Number, Balance, Last Reconciled
│   │   ├── View: Form
│   │   └── Inspector Panel: Account details, recent transactions
│   │
│   ├── TABLE: Bank Transaction
│   │   ├── View: Table (default) — columns: Tx#, Bank Account, Date, Amount, Status, Reconciled
│   │   ├── View: Form
│   │   └── Inspector Panel: Transaction details, reconciliation match
│   │
│   ├── TABLE: Cash Location
│   │   ├── View: Table (default) — columns: Location#, Name, Current Balance, Last Audit, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Location details, transaction history, audit log
│   │
│   ├── TABLE: Shift Audit
│   │   ├── View: Table (default) — columns: Audit#, Cash Location, Shift Date, User, Opening, Closing, Variance
│   │   ├── View: Calendar — by shift date
│   │   ├── View: Form
│   │   ├── Modal: OpenShift
│   │   ├── Modal: CloseShift
│   │   └── Inspector Panel: Audit details, transactions list, variance explanation
│   │
│   ├── TABLE: Shift Transaction (child table, accessed via Shift Audit Inspector)
│   │
│   ├── TABLE: Payment Followup Template
│   │   ├── View: Table (default) — columns: Template#, Name, Days Overdue Trigger, Subject, Active
│   │   ├── View: Form
│   │   └── Inspector Panel: Template content, usage stats
│   │
│   └── TABLE: Credit Adjustment (also in Client Credit)
│       ├── View: Table (default) — (same as Client Credit)
│       └── Inspector Panel: (same as Client Credit)
│
├── SHEET 5: Relationships (accent: #E0F7FA teal)
│   ├── TABLE: Customer (ERPNext builtin + custom fields)
│   │   ├── View: Table (default) — columns: Customer Name, License#, Is Seller, Credit Limit Mode, VIP Enabled, Sales Rep, Referred By, Credit Status
│   │   ├── View: Form
│   │   ├── Modal: CreditCheckDetail (shows check_credit result)
│   │   └── Inspector Panel: Customer details, credit summary, communication log, orders, invoices
│   │
│   ├── TABLE: Credit Limit (also in Client Credit)
│   │   └── (same as Client Credit)
│   │
│   ├── TABLE: Credit Adjustment (also in Client Credit)
│   │   └── (same as Client Credit)
│   │
│   ├── TABLE: Credit Override Request (also in Client Credit)
│   │   └── (same as Client Credit)
│   │
│   ├── TABLE: Client Communication Log
│   │   ├── View: Table (default) — columns: Log#, Customer, Type (Call/Email/Meeting), Date, Summary, Rep
│   │   ├── View: Timeline — chronological
│   │   ├── View: Form
│   │   └── Inspector Panel: Log details, linked documents
│   │
│   ├── TABLE: Client Need (also in Sales)
│   │   └── (same as Sales)
│   │
│   ├── TABLE: VIP Portal Configuration
│   │   ├── View: Table (default) — columns: Config#, Customer, Catalog Access, Appointment Booking, Leaderboard Visible, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Config details, portal preview link
│   │
│   ├── TABLE: Supplier (also in Procurement)
│   │   └── (same as Procurement)
│   │
│   ├── TABLE: Supplier Supply (also in Sales, Procurement)
│   │   └── (same as Sales)
│   │
│   ├── TABLE: Supplier Harvest Reminder (also in Procurement)
│   │   └── (same as Procurement)
│   │
│   └── TABLE: Match Record (also in Sales)
│       └── (same as Sales)
│
├── SHEET 6: Client Credit (accent: #FFFDE7 gold)
│   ├── TABLE: Credit Limit
│   │   ├── View: Table (default) — columns: Customer, Limit Amount, Enforcement Mode, Utilization %, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: Limit details, utilization chart, adjustment history
│   │
│   ├── TABLE: Credit Adjustment
│   │   ├── View: Table (default) — columns: Adjustment#, Customer, Type (Increase/Decrease), Amount, Reason, Approved By, Date
│   │   ├── View: Form
│   │   └── Inspector Panel: Adjustment details, before/after comparison
│   │
│   ├── TABLE: Credit Override Request
│   │   ├── View: Table (default) — columns: Request#, Sales Order, Customer, Amount Over, Requested By, Status, Approver
│   │   ├── View: Kanban — by status (Pending → Approved → Rejected)
│   │   ├── View: Form
│   │   ├── Modal: ApproveOverride (Accounts Manager action)
│   │   ├── Modal: RejectOverride
│   │   └── Inspector Panel: Request details, credit snapshot, approval notes
│   │
│   ├── TABLE: Referral Credit (also in Finance)
│   │   └── (same as Finance)
│   │
│   └── TABLE: Invoice Dispute (also in Finance)
│       └── (same as Finance)
│
├── SHEET 7: Admin (accent: #ECEFF1 slate)
│   ├── TABLE: User
│   │   ├── View: Table (default) — columns: User, Full Name, Email, Roles, Last Login, Status
│   │   ├── View: Form
│   │   └── Inspector Panel: User details, role assignments, activity log
│   │
│   ├── TABLE: Role
│   │   ├── View: Table (default) — columns: Role Name, Is Custom, Users Count
│   │   ├── View: Form
│   │   └── Inspector Panel: Role details, permissions summary, assigned users
│   │
│   ├── TABLE: Role Permission for Page and Report
│   │   ├── View: Table (default) — columns: Page/Report, Role, Read, Write
│   │   └── Inspector Panel: Permission details
│   │
│   ├── TABLE: Feature Flag
│   │   ├── View: Table (default) — columns: Flag Name, Enabled, Rollout %, Environment, Updated
│   │   ├── View: Form
│   │   └── Inspector Panel: Flag details, usage stats
│   │
│   ├── TABLE: Organization Settings
│   │   ├── View: Form (single document)
│   │   └── Inspector Panel: All org-level settings in grouped sections
│   │
│   ├── TABLE: Leaderboard Weight Config
│   │   ├── View: Table (default) — columns: Config#, Master Weight, Financial Weight, Engagement Weight, Reliability Weight, Growth Weight
│   │   ├── View: Form
│   │   └── Inspector Panel: Config details, preview calculation
│   │
│   ├── TABLE: Leaderboard Rank History
│   │   ├── View: Table (default) — columns: Customer, Week, Rank, Master Score, Financial, Engagement, Reliability, Growth
│   │   ├── View: Chart — rank over time per customer
│   │   └── Inspector Panel: History details, score breakdown
│   │
│   ├── TABLE: Appointment Request
│   │   ├── View: Table (default) — columns: Request#, Customer, Type, Requested Date, Status, Assigned To
│   │   ├── View: Kanban — by status (Pending → Confirmed → Completed → Cancelled)
│   │   ├── View: Calendar — by requested date
│   │   ├── View: Form
│   │   └── Inspector Panel: Request details, confirmation actions
│   │
│   ├── TABLE: Time Off Request
│   │   ├── View: Table (default) — columns: Request#, User, Type, Start Date, End Date, Status, Approver
│   │   ├── View: Calendar — by date range
│   │   ├── View: Form
│   │   └── Inspector Panel: Request details, approval actions
│   │
│   ├── TABLE: Hour Tracking
│   │   ├── View: Table (default) — columns: Entry#, User, Date, Hours, Project/Task, Status
│   │   ├── View: Calendar — by date
│   │   ├── View: Form
│   │   └── Inspector Panel: Entry details, linked project
│   │
│   ├── TABLE: Audit Log (read-only)
│   │   ├── View: Table (default) — columns: Log#, DocType, Document, Action, User, Timestamp, Changes
│   │   └── Inspector Panel: Log details, diff view
│   │
│   └── TABLE: Error Log (read-only)
│       ├── View: Table (default) — columns: Log#, Title, Seen, Method, Timestamp
│       └── Inspector Panel: Full error details, stack trace
│
├── CALCULATED SHEETS (Reports)
│   ├── REPORT: Client Leaderboard
│   │   ├── View: Table — columns: Rank, Customer, Master Score, Financial, Engagement, Reliability, Growth, Trend
│   │   ├── View: Chart — bar chart of top 20
│   │   └── Filters: Week selector, score type toggle
│   │
│   ├── REPORT: Inventory Aging
│   │   ├── View: Table — columns: Batch, Item, Warehouse, Qty, Age Days, Age Bucket, Value
│   │   ├── View: Chart — stacked bar by age bucket
│   │   └── Filters: Warehouse, Age bucket, Item group
│   │
│   ├── REPORT: Revenue Trends
│   │   ├── View: Chart (default) — line chart over time
│   │   ├── View: Table — period breakdown
│   │   └── Filters: Date range, granularity (day/week/month), customer segment
│   │
│   ├── REPORT: Shrinkage Report
│   │   ├── View: Table — columns: Batch, Item, Expected Qty, Actual Qty, Shrinkage, Shrinkage %, Reason
│   │   ├── View: Chart — pie chart by reason
│   │   └── Filters: Date range, warehouse, reason
│   │
│   └── REPORT: Top Clients
│       ├── View: Table — columns: Rank, Customer, Revenue, Orders, Avg Order Value, Growth %
│       ├── View: Chart — bar chart
│       └── Filters: Date range, sales rep, customer segment
│
├── VIP CLIENT PORTAL (external, separate route tree)
│   ├── Portal: Dashboard
│   │   └── Components: LeaderboardRankCard, RecentOrdersWidget, CreditSummaryWidget, AppointmentWidget
│   │
│   ├── Portal: Live Catalog
│   │   ├── View: Grid — product cards with batch info
│   │   ├── View: Table — spreadsheet of available batches
│   │   └── Actions: Add to cart, request sample, mark interest
│   │
│   ├── Portal: Appointments
│   │   ├── View: Calendar — available slots
│   │   ├── View: List — upcoming/past appointments
│   │   └── Modal: BookAppointment
│   │
│   ├── Portal: Marketplace (Client Needs)
│   │   ├── View: Table — own needs and matches
│   │   └── Modal: SubmitNeed
│   │
│   ├── Portal: Invoices
│   │   ├── View: Table — all invoices with payment status
│   │   └── Actions: Pay now, dispute, download PDF
│   │
│   └── Portal: Leaderboard
│       ├── View: Table — current rankings (anonymized except own)
│       └── View: Chart — own rank history
│
└── SHARED SALES SHEET (public token link)
    ├── View: Table — read-only product list from Sales Catalogue
    ├── View: Grid — visual product cards
    ├── Actions: Request quote (captures lead info)
    └── Modal: RequestQuoteForm
```

---

## 2. Design System

### 2.1 Color Palette

```css
/* Semantic Neutrals (Apple Numbers-inspired off-whites and grays) */
--color-canvas:          #FAFAFA;   /* Main background */
--color-surface:         #FFFFFF;   /* Cards, panels, table bg */
--color-surface-raised:  #FFFFFF;   /* Modals, dropdowns */
--color-border:          #E5E5E5;   /* Hairline rules (1px) */
--color-border-subtle:   #F0F0F0;   /* Table cell dividers */
--color-text-primary:    #1D1D1F;   /* Headings, primary content */
--color-text-secondary:  #6E6E73;   /* Labels, metadata */
--color-text-tertiary:   #AEAEB2;   /* Placeholders, disabled */
--color-text-inverse:    #FFFFFF;   /* On dark backgrounds */

/* Interactive */
--color-accent:          #007AFF;   /* Primary actions, links */
--color-accent-hover:    #0066D6;   /* Hover state */
--color-accent-subtle:   #E5F1FF;   /* Selected row, focus ring bg */

/* Semantic States */
--color-success:         #34C759;
--color-success-bg:      #E8F9ED;
--color-warning:         #FF9500;
--color-warning-bg:      #FFF4E5;
--color-error:           #FF3B30;
--color-error-bg:        #FFEBE9;

/* Credit Check Specific */
--color-credit-allowed:  #34C759;   /* Green checkmark */
--color-credit-warning:  #FF9500;   /* Amber badge (WARNING mode) */
--color-credit-soft:     #FF9500;   /* Amber with block icon (SOFT_BLOCK) */
--color-credit-hard:     #FF3B30;   /* Red block icon (HARD_BLOCK) */

/* Seven Sheet Accent Hues (subtle tints for sheet identity) */
--sheet-sales:           #E8F5E9;   /* Sage green */
--sheet-sales-accent:    #4CAF50;
--sheet-inventory:       #E3F2FD;   /* Sky blue */
--sheet-inventory-accent:#2196F3;
--sheet-procurement:     #FFF3E0;   /* Peach */
--sheet-procurement-accent:#FF9800;
--sheet-finance:         #F3E5F5;   /* Lavender */
--sheet-finance-accent:  #9C27B0;
--sheet-relationships:   #E0F7FA;   /* Teal */
--sheet-relationships-accent:#00BCD4;
--sheet-credit:          #FFFDE7;   /* Gold */
--sheet-credit-accent:   #FFC107;
--sheet-admin:           #ECEFF1;   /* Slate */
--sheet-admin-accent:    #607D8B;
```

### 2.2 Typography

```css
/* Font Stack */
--font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
--font-mono: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;

/* Type Scale */
--text-xs:    11px;   /* Column type chips, timestamps */
--text-sm:    13px;   /* Table cells, metadata, captions */
--text-base:  15px;   /* Body text, form labels */
--text-lg:    17px;   /* Section headers, table headers */
--text-xl:    20px;   /* Sheet titles */
--text-2xl:   24px;   /* Page titles */
--text-3xl:   28px;   /* Dashboard KPIs */

/* Font Weights */
--weight-regular:    400;
--weight-medium:     500;
--weight-semibold:   600;
--weight-bold:       700;

/* Line Heights */
--leading-tight:     1.2;
--leading-normal:    1.5;
--leading-relaxed:   1.75;

/* Letter Spacing */
--tracking-tight:   -0.02em;  /* Large headings */
--tracking-normal:   0;        /* Body */
--tracking-wide:     0.02em;   /* Caps labels */

/* Concrete Styles */
.text-page-title    { font-size: var(--text-2xl); font-weight: var(--weight-semibold); letter-spacing: var(--tracking-tight); color: var(--color-text-primary); }
.text-sheet-title   { font-size: var(--text-xl); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.text-section-title { font-size: var(--text-lg); font-weight: var(--weight-medium); color: var(--color-text-primary); }
.text-table-header  { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.text-cell          { font-size: var(--text-sm); font-weight: var(--weight-regular); color: var(--color-text-primary); }
.text-cell-secondary{ font-size: var(--text-sm); font-weight: var(--weight-regular); color: var(--color-text-secondary); }
.text-caption       { font-size: var(--text-xs); font-weight: var(--weight-regular); color: var(--color-text-tertiary); }
.text-kpi           { font-size: var(--text-3xl); font-weight: var(--weight-bold); letter-spacing: var(--tracking-tight); color: var(--color-text-primary); }
```

### 2.3 Spacing Scale

```css
--space-0:   0;
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;

/* Component-Specific Spacing */
--sidebar-width:          220px;
--sidebar-collapsed:      56px;
--inspector-width:        320px;
--toolbar-height:         48px;
--sheet-tab-height:       36px;
--table-row-height:       40px;
--table-header-height:    36px;
--cell-padding-x:         12px;
--cell-padding-y:         8px;
--modal-padding:          24px;
--card-padding:           16px;
```

### 2.4 Border Radius

```css
--radius-none:  0;
--radius-sm:    4px;    /* Chips, small buttons */
--radius-md:    8px;    /* Cards, inputs, dropdowns */
--radius-lg:    12px;   /* Modals, panels */
--radius-xl:    16px;   /* Large cards, sheet containers */
--radius-full:  9999px; /* Pills, avatars */
```

### 2.5 Shadows

```css
/* Apple Numbers-style subtle shadows */
--shadow-none:    none;
--shadow-sm:      0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:      0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-lg:      0 4px 16px rgba(0, 0, 0, 0.12);
--shadow-xl:      0 8px 32px rgba(0, 0, 0, 0.16);

/* Specific Elevations */
--shadow-card:       var(--shadow-sm);
--shadow-dropdown:   var(--shadow-md);
--shadow-modal:      var(--shadow-xl);
--shadow-toast:      var(--shadow-lg);
--shadow-inspector:  -2px 0 8px rgba(0, 0, 0, 0.06);
```

### 2.6 Motion

```css
/* Durations */
--duration-instant:   0ms;
--duration-fast:      100ms;
--duration-normal:    200ms;
--duration-slow:      300ms;
--duration-slower:    500ms;

/* Easings */
--ease-out:           cubic-bezier(0.16, 1, 0.3, 1);    /* Primary: deceleration */
--ease-in-out:        cubic-bezier(0.65, 0, 0.35, 1);   /* Modals, panels */
--ease-spring:        cubic-bezier(0.34, 1.56, 0.64, 1);/* Bouncy: toasts, badges */

/* Concrete Transitions */
--transition-colors:    color var(--duration-fast) var(--ease-out),
                        background-color var(--duration-fast) var(--ease-out),
                        border-color var(--duration-fast) var(--ease-out);
--transition-transform: transform var(--duration-normal) var(--ease-out);
--transition-opacity:   opacity var(--duration-normal) var(--ease-out);
--transition-shadow:    box-shadow var(--duration-normal) var(--ease-out);
--transition-all:       all var(--duration-normal) var(--ease-out);

/* Animation Keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideInUp {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### 2.7 Iconography

```
Icon Set: Lucide React (MIT licensed, consistent with Apple aesthetic)
Icon Size Scale:
  --icon-xs:  12px   (inline with text-xs)
  --icon-sm:  16px   (inline with text-sm, table cells)
  --icon-md:  20px   (buttons, form icons)
  --icon-lg:  24px   (toolbar, navigation)
  --icon-xl:  32px   (empty states, KPIs)

Stroke Width: 1.5px (default), 2px for emphasis
Color: Inherit from text color, or explicit semantic color
```

### 2.8 Sheet Accent Application

```
Each sheet's accent is applied:
1. Sheet tab background when active: var(--sheet-{name})
2. Sheet tab left border when active: 3px solid var(--sheet-{name}-accent)
3. Sidebar section header icon: var(--sheet-{name}-accent)
4. Table selection highlight (subtle): var(--sheet-{name}) at 50% opacity
5. Inspector panel header stripe: 3px top border of var(--sheet-{name}-accent)
```

---

## 3. Screen Inventory (15 Routes)

### Route 1: Dashboard (`/`)
**Components:** `<DashboardPage>`, `<KPICard>`, `<MiniTable>`, `<ChartCard>`, `<NotificationFeed>`

**Data Shape:**
```typescript
interface DashboardData {
  kpis: {
    operational: { label: string; value: string; trend: number; }[];
    inventory: { totalBatches: number; liveValue: number; agingAlert: number; };
    cash: { onHand: number; receivables: number; payables: number; };
  };
  recentOrders: SalesOrderRow[];
  creditOverrideQueue: CreditOverrideRow[];
  inventoryAging: AgingBucket[];
  upcomingDeliveries: DeliveryRow[];
}
```

**Interactions:**
- KPI cards clickable → navigate to relevant sheet
- Mini-tables show 5 rows, "View all" link to full table
- Chart cards have period toggles (7d / 30d / 90d)

**Tables Covered:** Aggregated from Sales Order, Credit Override Request, Batch, Delivery Note

---

### Route 2: Sales Sheet (`/sales`)
**Components:** `<SheetPage>`, `<TableBrowser>`, `<SheetTable>`, `<FilterBar>`, `<ViewSwitcher>`, `<Inspector>`

**Data Shape:**
```typescript
interface SalesOrderRow {
  id: string;
  name: string;           // SO-00001
  customer: string;
  customerLink: string;
  status: 'Draft' | 'Submitted' | 'Ordered' | 'Fulfilled' | 'Invoiced';
  total: number;
  creditStatus: 'allowed' | 'warning' | 'soft_block' | 'hard_block';
  pricingProfile: string | null;
  orderSource: 'Manual' | 'Catalogue' | 'VIP Portal' | 'Live Session';
  created: string;        // ISO date
  items: SalesOrderItem[];
}

interface SalesOrderItem {
  item: string;
  batch: string;
  qty: number;
  rate: number;
  cogsBase: number;
  markup: number;
  appliedRules: string[];
}
```

**Interactions:**
- Default view: Table of Sales Orders
- Sidebar: Expandable list of all Sales tables (Quotation, Sales Return, etc.)
- Click row → Inspector panel slides in with full details
- Double-click row → Form overlay opens
- Column headers: click to sort, right-click for filter/hide
- Filter bar: Filter pills, saved filters dropdown
- View switcher: Table / Kanban / Calendar
- Toolbar: New (Cmd+N), Export, Share
- Inline credit badge shows result of `check_credit` per row

**Tables Covered:** Sales Order, Quotation, Sales Return, Sales Catalogue, Live Shopping Session, Client Need, Supplier Supply, Match Record, Pricing Profile, COGS Rule

---

### Route 3: Inventory Sheet (`/inventory`)
**Components:** `<SheetPage>`, `<TableBrowser>`, `<SheetTable>`, `<KanbanBoard>`, `<FilterBar>`, `<Inspector>`

**Data Shape:**
```typescript
interface BatchRow {
  id: string;
  sku: string;
  item: string;
  strain: string;
  batchStatus: 'Intake' | 'Photography' | 'Ready' | 'Live' | 'Sold' | 'Depleted';
  supplier: string;
  lotNumber: string;
  qty: number;
  unitCost: number;
  vendorRangeLow: number;
  vendorRangeHigh: number;
  photographyStatus: 'Pending' | 'In Progress' | 'Complete';
  intakeSession: string | null;
  warehouse: string;
  createdAt: string;
}
```

**Interactions:**
- Default view: Table of Batches
- Kanban view: Drag-drop between status columns (triggers `batch_status_history` entry)
- Photography Queue sub-table with priority sorting
- Intake Session with "New Intake" wizard modal
- Inspector shows: status history timeline, linked images, intake session

**Tables Covered:** Batch, Batch Status History, Intake Session, Stock Entry, Delivery Note, Photography Queue, Sample Request, Workflow Queue Status, Warehouse, Stock Ledger Entry, Item, THCA Strain, Product Grade

---

### Route 4: Procurement Sheet (`/procurement`)
**Components:** `<SheetPage>`, `<TableBrowser>`, `<SheetTable>`, `<CalendarView>`, `<Inspector>`

**Data Shape:**
```typescript
interface PurchaseOrderRow {
  id: string;
  name: string;
  supplier: string;
  status: 'Draft' | 'Ordered' | 'Partial' | 'Received' | 'Billed';
  total: number;
  expectedDate: string | null;
  itemsCount: number;
  receivedQty: number;
  billedAmount: number;
}
```

**Interactions:**
- PO calendar view shows expected delivery dates
- Supplier Harvest Reminder calendar integration
- Quick actions: Create PO from Supplier Supply, Convert to Receipt

**Tables Covered:** Purchase Order, Purchase Receipt, Supplier, Supplier Supply, Supplier Harvest Reminder, Purchase Invoice, Payment Entry

---

### Route 5: Finance Sheet (`/finance`)
**Components:** `<SheetPage>`, `<TableBrowser>`, `<SheetTable>`, `<KanbanBoard>`, `<CalendarView>`, `<Inspector>`

**Data Shape:**
```typescript
interface SalesInvoiceRow {
  id: string;
  name: string;
  customer: string;
  status: 'Draft' | 'Submitted' | 'Partially Paid' | 'Paid' | 'Overdue';
  total: number;
  outstanding: number;
  dueDate: string;
  daysOverdue: number;
  hasDispute: boolean;
  installmentPlan: boolean;
}
```

**Interactions:**
- Invoice Kanban with overdue highlighting
- Shift Audit with Open/Close shift modals
- Cash Location quick balance view
- Payment Entry linked views

**Tables Covered:** Sales Invoice, Payment Entry, Invoice Dispute, Installment Payment, Referral Credit, Crypto Payment, Transaction Fee, Journal Entry, GL Entry, Account, Bank Account, Bank Transaction, Cash Location, Shift Audit, Payment Followup Template, Credit Adjustment

---

### Route 6: Relationships Sheet (`/relationships`)
**Components:** `<SheetPage>`, `<TableBrowser>`, `<SheetTable>`, `<CreditBanner>`, `<Inspector>`

**Data Shape:**
```typescript
interface CustomerRow {
  id: string;
  name: string;
  licenseNumber: string | null;
  isSeller: boolean;
  