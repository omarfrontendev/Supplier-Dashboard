# Flow 05 — Bookings

## Goal
Implement the complete Bookings flow shown in Figma, preserving the current Hoteliana design system, shared top navigation, bilingual behavior, and responsive page structure.

## Screens and flow
1. **Bookings list**
   - Match the header, arrivals/departures/change-request counters, two On Request attention cards, status filters, search and selectors, export, table data, statuses, and row actions.
   - Make every filter and action functional and connect each booking to its correct stateful detail screen.

2. **Booking details**
   - Add a reusable booking-detail layout for booking summary, availability/calendar impact, booking facts, guest and room occupants, special requests, and the state-specific outcome panel.
   - Render the supplied Figma data and copy for On Request, Confirmed, reference pending, Rejected, Expired, cancellation-request, and amendment-request states.

3. **On Request decisions**
   - Implement the live request state and countdown presentation.
   - Add the confirmation drawer with confirmation-number-now/later choices, optional PMS reference and note, calendar impact, and final confirmation.
   - Add rejection and result states; expired requests remain read-only.

4. **Confirmed booking actions**
   - Add the hotel confirmation number dialog and transition from reference pending to complete.
   - Add cancellation and amendment review flows with their Figma confirmation and outcome states.
   - Add Report an issue, alternatives, optional stop sale, and the sent-to-Hoteliana receipt.

5. **Integration and verification**
   - Connect the existing Bookings top-navigation item to `/bookings` and add typed routes for `/bookings/$bookingId`.
   - Keep state in the shared in-session portal store so list badges and detail actions update together.
   - Add unique metadata for both routes, Arabic translations using Cairo, RTL layouts, mobile card alternatives for wide tables, and desktop/mobile interaction tests.

## Technical notes
- Reuse existing semantic tokens and shared Button, Select, Dialog, Sheet, status, notification, and page-shell patterns.
- Model booking status and secondary tasks separately so Confirmed can coexist with reference, cancellation, amendment, or issue states.
- Keep confirmed-booking issue reporting non-destructive, matching Figma: it creates an issue receipt without cancelling the booking.
- Do not add a database; this MVP uses the existing in-session data architecture.