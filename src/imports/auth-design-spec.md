Design the complete Authentication & Multi-Tenant Foundation module for:

SOMAS – Social Mass Payments & Savings Platform

SOMAS is a compliance-driven, multi-tenant financial infrastructure system used for large-scale social transfers.

The designs must be:
	•	Simple
	•	Elegant
	•	Institutional
	•	Modern
	•	Minimal
	•	Scalable
	•	Audit-ready

Use Shadcn Design System principles.

⸻

DESIGN SYSTEM REQUIREMENTS

Follow Shadcn structure:
	•	Clean spacing scale (4 / 8 / 16 / 24 / 32 / 48 / 64)
	•	Subtle borders instead of heavy shadows
	•	Muted background surfaces
	•	Clear component variants
	•	Accessible focus states
	•	Minimal visual noise

Typography:
Inter

Color palette:
Primary Blue: #0B2C4D
Accent Teal: #00A7A0
Background: #F7F9FB
Text Primary: #1A1F2B
Muted Text: #6B7280

Status:
Success: #1F9D55
Warning: #F59E0B
Error: #DC2626

No gradients.
No decorative shadows.
No startup-style UI.

⸻

SCREENS TO DESIGN

⸻

1️⃣ ENTRY GATEWAY SCREEN

Purpose:
Allow user to select operational environment.

Layout:

Centered logo:
SOMAS

Subtitle:
“Social Mass Payments & Savings Platform”

Message:
“Select your operational environment”

Two large selection cards:
	1.	Backoffice Platform
	•	Campaign Management
	•	Monitoring & Reporting
	•	Governance & Audit
	2.	Field Operations App
	•	Beneficiary Verification
	•	Offline Sync
	•	Field Confirmation

Minimal.
Structured.
Institutional.

⸻

2️⃣ TENANT-AWARE LOGIN SCREEN

This is a multi-tenant platform.

Design login flow with:

Email input
Password input

Primary button:
“Sign In”

Subtext:
“Access is monitored for compliance.”

Add:
	•	Failed login message state
	•	Account locked state
	•	Disabled account state
	•	Loading state on button

Optional:
Display detected tenant after email entry.

⸻

3️⃣ FORGOT PASSWORD FLOW

Screen 1:
Enter email

Screen 2:
Confirmation message:
“If an account exists, a reset link has been sent.”

Screen 3:
Reset password form:
	•	New password
	•	Confirm password

Add:
Password strength indicator (subtle).

⸻

4️⃣ TENANT SWITCHER COMPONENT

Inside authenticated layout.

Top navigation right side:

Tenant dropdown showing:
	•	Tenant logo
	•	Tenant name

When clicked:
Dropdown list of available tenants.

Selecting tenant:
Triggers secure session switch.

Design as clean dropdown using Shadcn style.

⸻

5️⃣ SESSION MANAGEMENT SCREEN (ADMIN VIEW)

Purpose:
Allow administrators to manage active sessions.

Table layout showing:
	•	User
	•	Tenant
	•	Device
	•	IP address
	•	Last activity
	•	Expiration time
	•	Session status (Active / Expired)

Action column:
“Revoke Session”

Include confirmation dialog.

Clean table using structured component layout.

⸻

6️⃣ USER SECURITY OVERVIEW PANEL

User profile page section:

Show:
	•	Last login
	•	Failed attempts count
	•	Account status
	•	Active sessions count

Include:

Button:
“Force Logout All Sessions”

⸻

7️⃣ ACCOUNT STATUS STATES

Design visual states for:

Active
Locked (too many failed attempts)
Disabled
Pending confirmation

Use badge variants.
Keep subtle and professional.

⸻

8️⃣ TOKEN & ACTIVITY INSIGHT PANEL (ADMIN)

Optional advanced screen:

Show:
	•	Total login count
	•	Failed login attempts
	•	Active tokens
	•	Refresh token expiration

Structured card layout.

⸻

INTERACTION RULES
	•	Show loading state on authentication
	•	Disable button while processing
	•	Clear error messaging
	•	Use subtle alerts (not aggressive)
	•	Focus-visible outlines
	•	Accessible color contrast

⸻

VISUAL TONE

This must feel like:

A national financial infrastructure system.
A compliance-first institutional platform.
A donor-trusted operational system.

It must NOT feel like:
	•	A fintech startup
	•	A marketing website
	•	A consumer banking app
	•	A biometric lab interface

⸻

OUTPUT EXPECTATION

Generate:

Entry Gateway
Login
Forgot Password
Reset Password
Tenant Switcher
Session Management
User Security Overview
Account State Variants

All aligned to Shadcn component structure.

Keep layout calm.
Keep hierarchy clear.
Keep interface restrained and elegant.
