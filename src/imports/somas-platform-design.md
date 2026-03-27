Design a complete enterprise-grade platform called:

SOMAS – Social Mass Payments & Savings Platform

This is a multi-tenant, compliance-driven financial infrastructure system for managing large-scale social transfers.

The platform supports:
	•	Campaign Management
	•	Mass Disbursements
	•	Savings Campaigns
	•	Field Verification
	•	User & Role Governance
	•	Audit & Compliance
	•	Real-time Metrics
	•	Multi-region reporting

The system includes:
	1.	Backoffice Web Platform (Admin)
	2.	Field Operations Mobile App (Enumerator)
	3.	Governance & Audit Layer

Design must be simple, elegant, institutional, and scalable.

Use Shadcn Design System principles.

⸻

SYSTEM ARCHITECTURE TO REFLECT IN UI

The UI must clearly represent:

Tenant
→ Campaign
→ Beneficiary
→ Transaction
→ Verification
→ Audit Log

Include visible system hierarchy.

⸻

MULTI-TENANCY (IMPORTANT)

Support multiple tenants.

Each tenant has:
	•	Name
	•	Logo
	•	Custom branding
	•	Separate campaigns
	•	Separate beneficiaries
	•	Separate metrics

Add:

Tenant switcher dropdown in top navigation.

⸻

BACKOFFICE MODULES TO DESIGN

⸻

1️⃣ Dashboard (Tenant-Level)

Display:
	•	Transactions Count
	•	Transactions Total Amount
	•	Success / Failed / Pending count
	•	New Beneficiaries
	•	Active Campaigns
	•	Savings Total Amount
	•	Savings Count

Include:
	•	Daily metrics
	•	Cumulative metrics
	•	Filter by date
	•	Filter by region

⸻

2️⃣ Campaign Management

List campaigns with:
	•	Status (Active / Closed / Suspended)
	•	Region
	•	Program
	•	Start date
	•	End date
	•	Total beneficiaries
	•	Total amount disbursed

Add:

Progress visualization
Savings indicator (if applicable)

⸻

3️⃣ Savings Campaign Module

Allow:
	•	Create savings campaign
	•	Link to campaign
	•	View savings per beneficiary
	•	View total savings amount
	•	View participation rate

Include:

Savings metrics dashboard.

⸻

4️⃣ Beneficiary Management

Display:
	•	Name
	•	MSISDN
	•	Email
	•	Campaign association
	•	Total savings
	•	Total disbursements
	•	Last transaction date

Include:

Beneficiary metrics panel:
	•	Total received
	•	Total saved
	•	Last activity

⸻

5️⃣ Transaction Lifecycle View

Design detailed transaction screen with:
	•	Transaction ID
	•	Beneficiary
	•	Campaign
	•	Type (enum)
	•	Amount
	•	Status (pending / confirmed / failed)
	•	Error message
	•	Executed at
	•	Created at

Include timeline view.

⸻

6️⃣ Audit Log Module

Display:
	•	User
	•	Action (enum)
	•	Entity
	•	Entity ID
	•	Data Before
	•	Data After
	•	Timestamp

Add:

Advanced filtering:
	•	By user
	•	By entity
	•	By date

Must feel compliance-grade.

⸻

7️⃣ User & Permission Management

Support:
	•	Users
	•	Roles
	•	Permissions
	•	RolePermission mapping
	•	UserPermission override

Design:

Permission matrix UI.

Add:

Toggle enable/disable user.
Last login timestamp.
Failed login counter.

⸻

8️⃣ User Activity Monitoring

Dashboard showing:
	•	Login count
	•	Failed logins
	•	Last activity
	•	Token sessions

⸻

9️⃣ SMS Template Module

Allow:
	•	Create SMS template
	•	Associate to campaign
	•	Preview template
	•	Track usage

⸻

🔟 System Events Viewer

Display:
	•	Event type
	•	Payload (JSON preview)
	•	Created at

Developer-friendly view.

⸻

FIELD APP MODULES

⸻

Authentication
	•	Login
	•	Token-based session
	•	Device binding
	•	Online/Offline mode
	•	Selfie verification on status change

⸻

Beneficiary Search

Search by:
	•	Phone
	•	Name
	•	Campaign

Offline supported.

⸻

Verification Flow

Capture:
	•	Confirmation status
	•	GPS
	•	Signature or photo
	•	Timestamp

Save offline.
Sync when connected.

⸻

Pending Sync Queue

Display:
	•	Number of unsynced records
	•	Retry option

⸻

Daily Summary

Show:
	•	Verifications completed
	•	Success rate
	•	Active time

⸻

ADDITIONAL FEATURES TO INCLUDE

⸻

Metrics Layer

Design dedicated Metrics screen:

DashboardDailyMetrics:
	•	transactionsCount
	•	transactionsTotalAmount
	•	newBeneficiariesCount
	•	savingsTotalAmount
	•	cumulative totals

⸻

BeneficiaryMetric View

Display:
	•	totalSaved
	•	totalReceived
	•	lastTransactionAt

⸻

SavingCampaign View

Show:
	•	Amount saved
	•	History (JSON structured timeline)
	•	Participation rate

⸻

Token & Session Management

Admin view of:
	•	Active sessions
	•	Token metadata
	•	Expiry
	•	Force logout

⸻

DESIGN RULES

Use:

Shadcn component structure
Minimal shadows
Muted surfaces
Clear borders
Consistent spacing

Avoid:

Visual clutter
Overuse of green
Decorative gradients

⸻

ENTRY SCREEN

First page must:

Allow user to choose:
	•	Backoffice Platform
	•	Field Operations App

Simple two-card layout.
Institutional.
Centered.
Elegant.

⸻

OVERALL EXPERIENCE

The system must feel like:

A national-scale financial infrastructure
A donor-trusted audit system
A compliance-first platform
A serious institutional tool

Not a startup.
Not a marketing site.
Not a fintech consumer app.

⸻

OUTPUT

Generate:

Complete Backoffice layout
Complete Field App layout
All modules mentioned above
All governance screens
All metrics dashboards
Permission matrix
Audit log view
Transaction detail view

Use consistent design system.