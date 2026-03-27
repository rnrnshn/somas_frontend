esign the Settings module for the platform SOMAS – Social Mass Payments & Savings Platform.

SOMAS is an enterprise-grade, multi-tenant system used to manage social transfer programs, beneficiaries, financial disbursements, savings initiatives, and operational monitoring.

The Settings module is responsible for system governance, security, and configuration. It should centralize all administrative controls while keeping the interface clean and structured.

Follow Shadcn Design System principles. The design must be minimal, professional, and institutional.

Use clean layouts, clear hierarchy, and subtle borders. Avoid visual clutter, heavy shadows, or decorative elements.

Typography should use Inter with clear spacing and simple visual hierarchy.

The Settings page should use internal navigation or tabs to organize the different configuration areas.

Create the following sections inside the Settings module:

Users
Roles
Permissions
Audit Logs
Sessions
System Events
SMS Templates
Tenant Settings

The Users section should display a table of system users with the following columns:

Name
Email
Role
Status
Last Login
Actions

Include actions such as creating a user, editing user information, disabling a user, resetting passwords, and assigning roles. Include search and filtering options.

The Roles section should allow administrators to define and manage roles. Display a table with role name, description, number of users assigned, and permissions count. Provide actions to create, edit, or delete roles.

The Permissions section should display a permission matrix. Rows should represent system modules such as campaigns, beneficiaries, transactions, savings programs, reports, and users. Columns should represent permission types such as view, create, edit, and delete. Use a structured grid with checkboxes.

The Audit Logs section should display administrative activity logs. The table should include user, action performed, entity affected, entity identifier, and timestamp. Provide filtering by user and date.

The Sessions section should display active user sessions. Columns should include user, device, IP address, last activity, and expiration time. Administrators should be able to revoke sessions or force logout.

The System Events section should display technical system events. The table should include event type, payload preview, and timestamp.

The SMS Templates section should allow administrators to manage message templates used for beneficiary communication. Display template name, message content, associated campaign, status, and actions.

The Tenant Settings section should display configuration for the tenant. Include fields for tenant name, logo, region, timezone, and notification settings.

The Settings module should feel structured, secure, and administrative in nature. The interface should prioritize clarity and control while maintaining a clean and minimal visual style consistent with the rest of the platform.