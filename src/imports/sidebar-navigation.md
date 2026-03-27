Update Sidebar Navigation – SOMAS Platform

Refactor and simplify the existing sidebar navigation for the SOMAS – Social Mass Payments & Savings Platform.

The goal is to reduce navigation complexity and align the sidebar with the operational workflow of the system.

The navigation should prioritize the main objects of the platform and hide secondary configuration items inside contextual pages.

Follow Shadcn Design System navigation principles.

Do not redesign the entire UI.
Only reorganize and simplify the sidebar.

⸻

DESIGN SYSTEM RULES

Use:

Clean vertical navigation
Neutral background
Subtle hover states
Clear active item highlight

Spacing scale:

8
16
24

Typography:

Inter
Regular weight navigation items

Avoid visual clutter.

⸻

SIDEBAR NAVIGATION STRUCTURE

Simplify the sidebar to the following main items:

Dashboard

Campaigns
Savings Programs

Beneficiaries

Transactions

Insights

Settings

⸻

NAVIGATION LOGIC

Campaigns
Manage social transfer programs.

Savings Programs
Manage savings initiatives linked to campaigns.

Beneficiaries
Manage the beneficiary directory and field verification activities.

Transactions
Manage financial operations including individual transactions and disbursement batches.

Insights
Access analytics dashboards and operational reports.

Settings
Manage platform configuration and governance features.

⸻

NESTED STRUCTURE

The following items should be accessed inside pages or as sub-navigation, not as top-level sidebar items:

Beneficiaries
Directory
Field Verification

Transactions
All Transactions
Disbursement Batches

Insights
Metrics
Reports

Settings
Users
Roles
Permissions
Audit Logs
Sessions
System Events

⸻

MULTI-TENANT CONTEXT

Display the active tenant in the header above the sidebar.

Include:

Tenant Logo
Tenant Name

⸻

VISUAL TONE

The sidebar must feel:

Minimal
Professional
Institutional

Avoid a cluttered or overly complex navigation.

⸻

EXPECTED OUTPUT

Update the sidebar to the following structure:

Dashboard

Campaigns
Savings Programs

Beneficiaries

Transactions

Insights

Settings

Maintain alignment with the existing UI and Shadcn design system.
