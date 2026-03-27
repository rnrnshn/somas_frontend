Payment Verification Flow – Field App

Design a Payment Verification flow for the Field Operations mobile app of the platform SOMAS – Social Mass Payments & Savings Platform.

The purpose of this flow is to allow field enumerators to verify that beneficiaries have successfully received their payments.

The interface must be simple, mobile-friendly, and optimized for field operations.

Follow the existing design system and maintain a minimal layout.

Create the following screens.

⸻

Beneficiary Payment Screen

Display the most recent payment for the beneficiary.

Show the following information:

Transaction Reference
Campaign Name
Payment Amount
Currency (MZN)
Payment Date
Mobile Money Provider
Phone Number

Include a button:

Verify Payment

⸻

Payment Verification Form

Allow the enumerator to confirm whether the beneficiary received the payment.

Include the following fields:

Payment Received (Yes / No)
Phone Number Confirmed (Yes / No)
Issue Reported (optional)
Enumerator Notes

⸻

Selfie Capture

Allow the enumerator to capture a selfie of the beneficiary as verification evidence.

Automatically capture:

Timestamp
GPS Location
Enumerator ID

⸻

Verification Result

Allow the enumerator to submit the verification result.

Verification status options should include:

Confirmed
Not Received
Issue Reported

⸻

Offline Support

Allow the verification to be stored offline if there is no internet connection.

Display a status:

Pending Sync

Provide a Sync button when connectivity is available.
