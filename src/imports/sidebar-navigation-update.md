Update Sidebar Navigation – SOMAS Platform

Refactor and update the existing sidebar navigation for the SOMAS – Social Mass Payments & Savings Platform.

SOMAS is an enterprise-grade, multi-tenant platform used to manage social transfer programs, beneficiaries, financial disbursements, savings initiatives, and compliance monitoring.

The sidebar must be updated to reflect the real operational workflow of the system, while maintaining a clean, simple, and elegant institutional interface.

The navigation must follow Shadcn Design System principles and prioritize clarity and operational efficiency.

Do not redesign the entire interface.
Only update the sidebar navigation structure and grouping.

⸻

DESIGN SYSTEM RULES

Follow Shadcn navigation guidelines.

Use:
	•	Clean vertical navigation
	•	Neutral background
	•	Subtle hover states
	•	Clear section grouping
	•	Minimal icons
	•	Consistent spacing

Spacing scale:

8
16
24

Typography:

Inter
Medium weight for section headers
Regular weight for navigation items

Avoid:
	•	Bright colors
	•	Heavy shadows
	•	Decorative UI
	•	Visual clutter

The interface must remain minimal and institutional.

⸻

SIDEBAR NAVIGATION STRUCTURE

Organize navigation according to the operational lifecycle of the platform.

The system workflow should follow:

Plan → Operate → Finance → Insights → Governance → Compliance → System

⸻

DASHBOARD

Top level item.

Dashboard shows system overview and operational KPIs.

Navigation item:

Dashboard

⸻

PLAN

Modules used to design and manage social programs.

Plan
Campaigns
Savings Campaigns

Campaigns → create and manage social transfer programs
Savings Campaigns → configure savings initiatives linked to campaigns

⸻

OPERATE

Modules used for operational management of beneficiaries and field activity.

Operate
Beneficiaries
Field Verification

Beneficiaries → manage beneficiary database
Field Verification → monitor enumerator confirmations and field validations

⸻

FINANCE

Modules related to financial operations.

Finance
Transactions
Disbursements

Transactions → view individual payment records
Disbursements → manage bulk payments and execution batches

⸻

INSIGHTS

Modules related to data analysis and monitoring.

Insights
Metrics
Reports

Metrics → operational dashboards and analytics
Reports → export campaign, transaction, and beneficiary data

⸻

COMMUNICATION

Modules used to communicate with beneficiaries.

Communication
SMS Templates

SMS Templates → configure automated campaign messaging

⸻

GOVERNANCE

Access and identity management.

Governance
Users
Roles
Permissions

Users → manage platform users
Roles → define role structures
Permissions → configure system access

⸻

COMPLIANCE

Monitoring, security and audit.

Compliance
Audit Logs
System Events
User Activity

Audit Logs → track administrative actions
System Events → system-level logs
User Activity → login and security monitoring

⸻

SYSTEM

Platform infrastructure and tenant configuration.

System
Tenant Settings
Sessions

Tenant Settings → configure tenant identity and platform configuration
Sessions → manage active login sessions and tokens

⸻

VISUAL STRUCTURE

The sidebar should include:
	•	collapsible navigation groups
	•	clear active state highlight
	•	icons only for main sections
	•	subtle separators between sections
	•	compact spacing

Sections should remain readable and structured even with many modules.

⸻

MULTI-TENANT CONTEXT

Display the active tenant in the header area above the sidebar.

Include:

Tenant Logo
Tenant Name

This indicates the active tenant environment.

⸻

INTERACTION BEHAVIOR

Sidebar sections must be collapsible.

Active pages must be clearly highlighted.

Hover states must be subtle and consistent.

Navigation must remain intuitive even for first-time users.

⸻

VISUAL TONE

The sidebar must feel:

Structured
Professional
Institutional
Operationally clear

It must not feel like:

A startup SaaS product
A marketing dashboard
A colorful consumer application

Clarity and hierarchy must be prioritized.

⸻

EXPECTED OUTPUT

Update the sidebar to follow this navigation hierarchy:

Dashboard

Plan
Campaigns
Savings Campaigns

Operate
Beneficiaries
Field Verification

Finance
Transactions
Disbursements

Insights
Metrics
Reports

Communication
SMS Templates

Governance
Users
Roles
Permissions

Compliance
Audit Logs
System Events
User Activity

System
Tenant Settings
Sessions

Maintain alignment with the existing interface layout and styling.