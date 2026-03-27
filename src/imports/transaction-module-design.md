Transaction Module – SOMAS

Design the Transaction Management module for the platform SOMAS – Social Mass Payments & Savings Platform.

SOMAS is a multi-tenant platform used to manage social transfer programs, beneficiaries, financial disbursements, and savings initiatives.

The Transaction module is responsible for tracking and managing all financial movements associated with beneficiaries.

The interface must be data-focused, structured, and operationally clear.

Follow Shadcn Design System principles and maintain a minimal, institutional visual style.

Avoid unnecessary visual elements and prioritize clarity and readability.

Create the following screens.

⸻

Transactions List

Design a table displaying all financial transactions.

Columns should include:

Transaction Reference
Beneficiary Name
Beneficiary Code
Campaign
Transaction Type
Amount
Mobile Money Provider
Status
Created Date
Executed Date
Actions

Provide search functionality and filters for:

Campaign
Transaction Type
Status
Mobile Money Provider
Date Range

Include status badges such as:

Pending
Processing
Successful
Failed
Reversed

Actions should include viewing transaction details.

⸻

Transaction Details

Design a detailed transaction view.

Display the following information:

Transaction Reference
Beneficiary
Campaign
Transaction Type
Amount
Currency
Mobile Money Provider
External Transaction ID
Status
Created Date
Execution Date
Error Message (if applicable)

Include a timeline showing the lifecycle of the transaction.

⸻

Disbursement Batches

Create a screen for batch payment execution.

Display batches used for mass payments.

Columns should include:

Batch ID
Campaign
Total Transactions
Total Amount
Successful
Failed
Execution Date
Status

Allow administrators to view batch details.

⸻

Failed Transactions

Design a screen displaying failed payments.

Columns should include:

Transaction Reference
Beneficiary
Campaign
Amount
Error Message
Date

Provide an action to retry failed transactions.

⸻

Transaction Analytics

Design an analytics dashboard showing:

Total Disbursed Amount
Number of Transactions
Success Rate
Failed Transactions
Transactions by Campaign
Transactions by Mobile Money Provider

Use cards and simple charts.

⸻

Use UI components such as:

Tables
Cards
Tabs
Badges
Filters
Dialogs

The module should allow administrators to monitor financial operations, investigate failed transactions, and track all financial activity related to beneficiaries.

Maintain a structured layout that supports high-volume operational use.