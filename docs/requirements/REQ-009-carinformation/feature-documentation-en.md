# Feature Documentation: Customer & Vehicle Data (Carinformation)

**Created:** 2026-02-26
**Requirement:** REQ-009-carinformation
**Language:** EN
**Status:** Implemented

---

## Overview

In the sixth wizard step, the user enters personal contact data (email, salutation, name, address, mobile phone number) and vehicle-related information (license plate, mileage, VIN). Additionally, GDPR consent must be given before the user is redirected to the booking overview.

---

## User Guide

### Step 1: Page Loads

![Desktop View](./screenshots/e2e-responsive-desktop.png)

**Description:** After completing the appointment selection (wizard step 5), the "Customer & Vehicle Data" page loads. The guard verifies that all previous wizard steps (brand, location, services, appointment) are completed. The page shows:
- Heading "Please provide us with final information about your appointment"
- Banner "Been with us before?" with button "Retrieve my data!" (click-dummy)
- Note "Required fields are marked with *"
- Empty form (or pre-filled fields when returning)

### Step 2: Fill in Customer Data

**Description:** The user fills in the customer data:
- **Email Address** — required, email format validated
- **Salutation** — dropdown with "Mr." and "Ms."
- **First Name** — letters only (including umlauts)
- **Last Name** — letters only (including umlauts)
- **Street and House Number** — free text
- **Postal Code** — digits only
- **City** — letters only (including umlauts)
- **Mobile Phone Number** — digits only, must start with 0

Each field has an icon with `.icon-framed` border. Validation occurs on `blur` (on-touch) with inline error messages.

### Step 3: Fill in Vehicle Data

**Description:** The user fills in the vehicle data:
- **License Plate** — format XX-XX1234
- **Mileage** — digits only
- **VIN** — exactly 17 alphanumeric characters, with info link "Explanation of VIN"

### Step 4: GDPR Consent

**Description:** The user checks the GDPR consent checkbox. Only then does the "To Booking Overview" button become enabled.

### Step 5: Submit Form

**Description:** The user clicks "To Booking Overview". The system:
1. Validates all fields completely (markAllAsTouched)
2. Saves `customerInfo`, `vehicleInfo`, and `privacyConsent` in the BookingStore
3. Navigates to the booking overview (next wizard step)

---

## Alternative Flows

### Returning Customer — Retrieve Data
The banner offers a "Retrieve my data!" button. In the click-dummy, this button has no function (placeholder for future API integration).

### Back Navigation
The "Back" button sets `selectedAppointment` to `null` (per REQ-007 WizardStateSync) and navigates back to the appointment selection (`/home/appointment`).

### VIN Explanation
The info link "Explanation of VIN" next to the VIN field is a click-dummy placeholder.

---

## Responsive Views

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Multi-column layouts:
- Salutation (25%) | First Name (37.5%) | Last Name (37.5%)
- Postal Code (30%) | City (70%)
- License Plate (50%) | Mileage (50%)

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Same multi-column layouts as desktop.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

All form fields in single column layout (AC-17).

---

## Accessibility

- **Keyboard Navigation:** All fields are reachable via Tab, form can be operated entirely via keyboard
- **Screen Reader:** All fields have `<label>` with `for`/`id` binding, `aria-required="true"` on required fields
- **Color Contrast:** WCAG 2.1 AA compliant (4.5:1 contrast ratio)
- **Focus Styles:** `:focus-visible` visible on all interactive elements
- **Touch Targets:** Minimum 2.75em (44px) for mobile devices

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/carinformation` |
| Container Component | `CarinformationContainerComponent` |
| Presentational Components | `CustomerFormComponent`, `VehicleFormComponent` |
| Store | `BookingStore` (extended with customerInfo, vehicleInfo, privacyConsent) |
| Guard | `carInformationGuard` (validates 4 prerequisites) |
| Validation | Reactive Forms with Validators (required, email, pattern) |
