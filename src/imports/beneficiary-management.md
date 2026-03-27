Design and update the Beneficiary Management module for the platform SOMAS – Social Mass Payments & Savings Platform.

SOMAS is a multi-tenant system used to manage social transfer programs, beneficiaries, financial disbursements, and savings initiatives.

The Beneficiary module manages the registry of individuals receiving financial support through campaigns and savings programs.

Update the existing Beneficiary module to support a more complete beneficiary profile with identity verification, location details, and mobile money information.

The interface must remain simple, structured, and institutional.

Follow Shadcn Design System principles and use clean layouts, subtle borders, and minimal visual noise.

Avoid decorative elements and maintain a professional operational tone.

Create or update the following screens.

Beneficiaries List

Display a searchable and filterable table of beneficiaries.

The table should include the following columns:

Beneficiary Code
Full Name
Phone Number
Province
District
Mobile Money Provider
Total Received
Total Saved
Verification Status
Status
Last Transaction
Actions

Provide search and filters for:

Campaign
Province
Verification Status
Status

Include actions such as viewing the beneficiary profile and editing beneficiary information.

Include buttons for:

Create Beneficiary
Import Beneficiaries (CSV upload)

⸻

Create Beneficiary

Design a structured form for adding a new beneficiary.

The form should include the following fields:

Full Name
Gender
Date of Birth

Phone Number (MSISDN)
Email (optional)

National ID
ID Type
National ID Verified (toggle)

Province
District
Community
Address

Mobile Money Provider
Mobile Money Account Name

Preferred Language

Status

Notes

Include validation for required fields and phone number format.

The system should automatically generate a Beneficiary Code when a beneficiary is created.

⸻

Beneficiary Profile

Design a detailed beneficiary profile page.

At the top display:

Beneficiary Code
Full Name
Phone Number
Province
District
Verification Status
Status

Display summary cards with the following metrics:

Total Received
Total Saved
Number of Campaigns
Last Transaction Date

The profile page should contain the following tabs:

Overview
Transactions
Savings
Campaigns
Verification

⸻

Overview Tab

Display basic beneficiary information including identity details, contact information, and location.

Include:

Full Name
Gender
Date of Birth
Phone Number
National ID
ID Type
Mobile Money Provider
Community Location

⸻

Transactions Tab

Display financial transactions associated with the beneficiary.

Columns should include:

Transaction ID
Campaign
Amount
Status
Date

⸻

Savings Tab

Display savings participation information.

Include:

Total Saved
Savings History
Savings Contributions

Use a table showing savings transactions.

⸻

Campaigns Tab

Display campaigns in which the beneficiary participates.

Columns should include:

Campaign Name
Program
Participation Status
Total Received

⸻

Verification Tab

Display field verification activity.

Include:

Verification Status
Enumerator
Verification Date
Verification Notes
Selfie Evidence (if available)

⸻

Use the following UI components:

Tables
Cards
Tabs
Forms
Badges
Dialogs

Maintain a minimal, structured interface consistent with the rest of the platform.

The module should allow administrators to easily manage beneficiary records, track financial activity, and verify beneficiary identity for program compliance and transparency.