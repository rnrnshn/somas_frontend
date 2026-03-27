Design the complete Dashboard & Metrics module for:

SOMAS – Social Mass Payments & Savings Platform

SOMAS is a multi-tenant, compliance-driven financial infrastructure system managing large-scale social transfers and savings campaigns.

The dashboard must:
	•	Be clean and elegant
	•	Use Shadcn Design System structure
	•	Be data-focused
	•	Feel institutional and enterprise-grade
	•	Communicate operational control and transparency

No decorative gradients.
No heavy shadows.
Minimal and structured layout.

⸻

DESIGN SYSTEM REQUIREMENTS

Use Shadcn component structure:
	•	Card
	•	CardHeader
	•	CardTitle
	•	CardContent
	•	Badge
	•	Tabs
	•	Table
	•	Alert
	•	DropdownMenu

Spacing scale:
4 / 8 / 16 / 24 / 32 / 48 / 64

Typography:
Inter

Color discipline:
Use Primary Blue and Teal sparingly.
Let white space dominate.

⸻

DASHBOARD STRUCTURE

Create tenant-aware dashboard.

Top navigation must display:
	•	Tenant logo
	•	Tenant name
	•	Date range selector
	•	Region filter
	•	Campaign filter

⸻

SECTION 1 – KPI SUMMARY CARDS

Design a responsive grid of KPI Cards.

Each card contains:

Small label
Large numeric value
Subtext or trend indicator

KPIs required:
	1.	Total Transactions
	2.	Total Disbursed Amount
	3.	Success Rate %
	4.	Failed Transactions Count
	5.	Active Campaigns
	6.	New Beneficiaries (selected period)
	7.	Total Savings Amount
	8.	Savings Participation Rate

Cards must be:
Minimal.
Bordered.
No heavy shadows.

⸻

SECTION 2 – DAILY METRICS PANEL

Create a separate section:

Title:
“Daily Operational Metrics”

Metrics:
	•	Transactions Today
	•	Amount Disbursed Today
	•	New Beneficiaries Today
	•	Savings Today

Include small trend arrows (up/down).
Keep subtle.

⸻

SECTION 3 – TRANSACTION STATUS DISTRIBUTION

Create a card with:

Donut or bar chart showing:
	•	Confirmed
	•	Pending
	•	Failed

Below chart:
Show numeric breakdown.

⸻

SECTION 4 – CAMPAIGN PERFORMANCE OVERVIEW

Table showing:
	•	Campaign Name
	•	Region
	•	Total Beneficiaries
	•	Total Amount
	•	Success Rate
	•	Status
	•	Progress Bar

Include:
Clickable rows → opens Campaign Details.

⸻

SECTION 5 – SAVINGS PERFORMANCE PANEL

Card showing:
	•	Total Savings Amount
	•	Active Savings Campaigns
	•	Average Savings per Beneficiary
	•	Participation %

Include small bar chart per region.

⸻

SECTION 6 – BENEFICIARY METRICS PANEL

Show:
	•	Total Beneficiaries
	•	Active Beneficiaries
	•	Inactive Beneficiaries
	•	Beneficiaries with Savings

Include small distribution chart by region.

⸻

SECTION 7 – SYSTEM HEALTH & ALERTS

Create structured Alert section for:
	•	Failed transaction spikes
	•	High failed login attempts
	•	Pending sync backlog
	•	Suspicious activity

Use Alert component.
Subtle warning styling.

⸻

SECTION 8 – QUICK ACTION PANEL

Small side card with buttons:
	•	Create Campaign
	•	Create Savings Campaign
	•	Export Report
	•	View Audit Logs

⸻

SECTION 9 – METRICS TABS

Add Tabs at top:

Tabs:

Overview
Transactions
Savings
Beneficiaries
Operational Health

Each tab loads different dashboard view.

⸻

TRANSACTIONS TAB VIEW

Include:

Line chart:
Transactions over time

Table:
Recent transactions:
	•	Transaction ID
	•	Beneficiary
	•	Campaign
	•	Amount
	•	Status
	•	Date

⸻

SAVINGS TAB VIEW

Include:
	•	Savings growth over time
	•	Savings per campaign
	•	Savings per region

⸻

BENEFICIARIES TAB VIEW

Include:
	•	Beneficiary growth chart
	•	Active vs inactive distribution
	•	Top regions

⸻

OPERATIONAL HEALTH TAB

Include:
	•	Active sessions count
	•	Failed logins
	•	System events count
	•	Pending field sync records

Structured in card grid.

⸻

INTERACTION REQUIREMENTS
	•	All metrics must respond to filters.
	•	Date range selector must update charts.
	•	Show loading skeleton while fetching data.
	•	Clear empty states if no data.
	•	Use consistent number formatting.

⸻

MULTI-TENANT RULE

All metrics must be tenant-scoped.

UI must clearly show active tenant in header.

No cross-tenant visibility.

⸻

VISUAL TONE

The dashboard must feel:

Authoritative
Controlled
Transparent
Calm
Professional

It must NOT feel like:

A fintech startup dashboard
A marketing analytics tool
A colorful SaaS growth app

Clarity over visual drama.

⸻

OUTPUT EXPECTATION

Generate:

Full Overview Dashboard
Transactions Tab
Savings Tab
Beneficiaries Tab
Operational Health Tab

All aligned to Shadcn structure.

Clean.
Elegant.
Institutional.
Data-first.
