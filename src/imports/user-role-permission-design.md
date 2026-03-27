Design the complete User, Role & Permission Management module for:

SOMAS – Social Mass Payments & Savings Platform

SOMAS is a multi-tenant, compliance-driven financial infrastructure platform.

This module must manage:
	•	Users
	•	Roles
	•	Permissions
	•	RolePermission mappings
	•	UserPermission overrides
	•	Account status
	•	Security governance

The interface must feel:
	•	Institutional
	•	Structured
	•	Elegant
	•	Minimal
	•	Enterprise-grade

Use Shadcn Design System principles.

⸻

DESIGN SYSTEM RULES

Use:
	•	Clean spacing scale (4 / 8 / 16 / 24 / 32 / 48 / 64)
	•	Subtle borders instead of heavy shadows
	•	Muted background surfaces
	•	Clear component variants
	•	Badge states
	•	Accessible interaction states

Typography:
Inter

Keep interface restrained and data-focused.

⸻

SCREENS TO DESIGN

⸻

1️⃣ USER LIST SCREEN

Purpose:
Display all users within selected tenant.

Table columns:
	•	Avatar
	•	Name
	•	Email
	•	Role
	•	Account Status (Active / Disabled / Locked)
	•	Last Login
	•	Failed Attempts
	•	Actions (Edit / Disable / View Details)

Include:
	•	Search bar
	•	Role filter
	•	Status filter
	•	“Create User” button

Design clean Shadcn-style table with subtle hover states.

⸻

2️⃣ CREATE / EDIT USER SCREEN

Form layout:

Sections:

Basic Information:
	•	Name
	•	Email
	•	MSISDN (optional)

Role Assignment:
	•	Role dropdown
	•	Option for multiple roles (if allowed)

Permission Overrides:
	•	Toggle:
“Enable custom permissions”

If enabled:
Show permission override panel.

Account Status:
	•	Active
	•	Disabled
	•	Locked

Security Info (read-only):
	•	Last login
	•	Failed attempts
	•	Active sessions

Primary button:
“Save User”

⸻

3️⃣ ROLE MANAGEMENT SCREEN

List all roles:

Table columns:
	•	Role Name
	•	Description
	•	Number of Users
	•	Number of Permissions
	•	Actions (Edit / Delete)

Button:
“Create Role”

⸻

4️⃣ CREATE / EDIT ROLE SCREEN

Fields:
	•	Role Name
	•	Description

Below:
Permission Matrix (advanced)

⸻

5️⃣ ADVANCED PERMISSION MATRIX DESIGN

This is the core of the module.

Design a grid-based matrix.

Rows:
System modules grouped by category:

Authentication
Users
Roles
Campaigns
Beneficiaries
Transactions
Savings
Reports
Audit Logs
SMS Templates
System Events

Each row expands to show granular permissions:

Example (Campaigns):
	•	View Campaign
	•	Create Campaign
	•	Edit Campaign
	•	Delete Campaign
	•	Approve Campaign
	•	Export Campaign Data

Columns:

Permission types:
	•	View
	•	Create
	•	Edit
	•	Delete
	•	Approve
	•	Export

Use:

Checkboxes in grid format.

Design must:
	•	Be scrollable
	•	Freeze first column
	•	Group permissions visually
	•	Support “Select All” per module
	•	Support “Select All” per column

Add:

Search filter inside permission matrix.

Keep layout clean and readable.
No visual clutter.

⸻

6️⃣ PERMISSION INHERITANCE VISUALIZATION

Add visual indicator:

If permission inherited from role:
Show subtle grey indicator.

If permission overridden at user level:
Show accent highlight.

Tooltip on hover:
“Inherited from Role: Admin”

This is important for clarity.

⸻

7️⃣ USER PERMISSION OVERRIDE PANEL

Inside User Edit screen:

Show permission matrix but:

Inherited permissions appear disabled.
Custom overrides are editable.

Include:
“Reset to role defaults” button.

⸻

8️⃣ ACCOUNT STATUS STATES

Design visual states for:

Active
Disabled
Locked (too many failed attempts)

Use Badge component variants.

Keep subtle and professional.

⸻

9️⃣ ROLE-PERMISSION RELATION VIEW

Optional advanced screen:

Show Role → Permission relationship summary.

Cards per role:

Admin:
Full access

Analytics:
Read-only access to:
	•	Dashboard
	•	Reports

Enumerator:
Access only to:
	•	Field App

⸻

🔟 SECURITY ACTION CONFIRMATION

For critical actions:
	•	Delete role
	•	Remove permission
	•	Disable user

Use AlertDialog component.

Message example:

“You are about to disable this user. This action will immediately revoke system access.”

Primary button:
Confirm

Secondary:
Cancel

⸻

INTERACTION RULES
	•	Show loading state when saving
	•	Disable save button if no changes
	•	Show unsaved changes warning
	•	Clear error messages for validation

⸻

MULTI-TENANT RULE

All users, roles, and permissions must be tenant-scoped.

UI must display active tenant in header.

No cross-tenant visibility.

⸻

VISUAL TONE

The Permission Matrix must feel:

Structured
Controlled
Authoritative
Enterprise-grade

Not complex.
Not overwhelming.
Not visually noisy.

Clarity over density.

⸻

OUTPUT EXPECTATION

Generate:

User List
User Create/Edit
Role List
Role Create/Edit
Advanced Permission Matrix
User Permission Override View
Role-Permission Summary View

All aligned to Shadcn structure.

Minimal.
Elegant.
Institutional.