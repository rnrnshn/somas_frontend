Design the Campaign Management module for:

SOMAS – Social Mass Payments & Savings Platform

SOMAS is a multi-tenant financial infrastructure system used to manage social transfer programs and savings campaigns.

The Campaign Management module is the operational core of the system.

It must allow administrators to:
	•	Create campaigns
	•	Upload beneficiaries
	•	Manage disbursements
	•	Monitor campaign progress
	•	Associate savings initiatives
	•	Track campaign performance

The interface must be:
	•	Simple
	•	Elegant
	•	Institutional
	•	Operationally efficient

Use Shadcn Design System principles.

⸻

DESIGN SYSTEM RULES

Use Shadcn component structure:

Card
Table
Tabs
Badge
Progress
Dialog
DropdownMenu
Alert
Form

Spacing scale:

4 / 8 / 16 / 24 / 32 / 48 / 64

Typography:
Inter

Minimal shadows.
Use borders and spacing to separate content.

⸻

SCREENS TO DESIGN

⸻

1️⃣ CAMPAIGN LIST SCREEN

Purpose:
Display all campaigns within the tenant.

Layout:

Top header:

Title:
“Campaigns”

Right side button:
“Create Campaign”

Filters:
	•	Status
	•	Region
	•	Program
	•	Date range

Table columns:
	•	Campaign Name
	•	Program
	•	Region
	•	Start Date
	•	End Date
	•	Total Beneficiaries
	•	Total Disbursement Amount
	•	Success Rate
	•	Status
	•	Actions

Status badges:

Active
Closed
Suspended
Draft

Actions dropdown:

View
Edit
Suspend
Close
Export data

Rows should be clickable → open campaign details.

⸻

2️⃣ CREATE CAMPAIGN SCREEN

Use multi-step form.

⸻

Step 1 – Campaign Details

Fields:

Campaign Name
Program Name
Region
Start Date
End Date
Description (optional)

Optional toggle:

Enable Savings Campaign

Primary button:
Next

⸻

Step 2 – Beneficiary Upload

Upload methods:
	•	CSV / Excel Upload
	•	Manual entry
	•	API integration (optional future state)

Upload area:

Drag & Drop file uploader.

Show preview table:

Columns:
	•	Name
	•	MSISDN
	•	Location
	•	Disbursement Amount

Validation indicators:

Valid
Duplicate
Invalid number

Display summary:

Total records
Valid records
Errors detected

Button:
Proceed

⸻

Step 3 – Disbursement Configuration

Fields:

Payment Channel:
	•	M-Pesa
	•	e-Mola
	•	Both

Disbursement Type:
	•	Fixed Amount
	•	Variable Amount

Execution Date

Optional:

Enable staged disbursement.

⸻

Step 4 – Review & Confirmation

Display summary:

Campaign Name
Total Beneficiaries
Total Disbursement Amount
Region
Payment Channel

Confirmation dialog before campaign creation.

Button:
Create Campaign

⸻

3️⃣ CAMPAIGN DETAIL SCREEN

Use Tabs.

Tabs:

Overview
Beneficiaries
Transactions
Savings
Reports

⸻

OVERVIEW TAB

Show summary cards:
	•	Total Beneficiaries
	•	Amount Disbursed
	•	Success Rate
	•	Pending Payments
	•	Failed Payments

Add progress bar:

Campaign completion %

Add small chart:

Disbursement progress over time.

⸻

BENEFICIARIES TAB

Table columns:

Name
MSISDN
Location
Amount
Status
Last Activity

Actions:

View profile
Flag issue

Search + filter available.

⸻

TRANSACTIONS TAB

Table:

Transaction ID
Beneficiary
Amount
Status
Error message (if any)
Execution date

Include retry button for failed transactions.

⸻

SAVINGS TAB

Visible only if savings enabled.

Display:

Total savings amount
Number of participants
Average savings per beneficiary

Table:

Beneficiary
Saved Amount
Last Deposit

Include savings participation chart.

⸻

REPORTS TAB

Buttons:

Export Beneficiaries
Export Transactions
Export Campaign Summary

Allow CSV and Excel export.

⸻

CAMPAIGN STATUS CONTROL

Inside Campaign Overview:

Buttons:

Suspend Campaign
Close Campaign

Show confirmation dialog.

⸻

PROGRESS VISUALIZATION

Use:

Progress bars
Subtle charts
Status badges

No complex visualizations.

⸻

VALIDATION STATES

Handle:

Invalid phone numbers
Duplicate beneficiaries
Empty uploads
Large file warnings

Use Alert component for feedback.

⸻

MULTI-TENANT RULE

Campaigns belong to a tenant.

Users must only see campaigns within their tenant.

Tenant context must be visible in the UI header.

⸻

INTERACTION RULES
	•	Show loading states when uploading beneficiaries
	•	Show progress indicator during bulk upload
	•	Disable actions while campaign is executing
	•	Provide clear error feedback

⸻

VISUAL TONE

Campaign Management must feel:

Operational
Organized
Reliable
Controlled

It must not feel:

Experimental
Colorful
Playful

Clarity and structure first.

⸻

OUTPUT EXPECTATION

Generate screens for:

Campaign List
Create Campaign (multi-step wizard)
Campaign Detail
Beneficiary Table
Transaction Table
Savings Panel
Reports Panel

All aligned with Shadcn design system.