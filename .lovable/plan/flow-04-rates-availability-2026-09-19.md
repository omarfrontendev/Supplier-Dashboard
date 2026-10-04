# Flow 04 — Rates & Availability

## Goal
Implement the 50 referenced Figma frames as one connected Rates & Availability workflow, preserving the existing Hoteliana design system, English/Arabic support, Cairo for Arabic, and the shared supply-contract data.

## Build
1. **Calendar foundation**
   - Replace the current weekly room-only matrix with the Figma 16-night room/offer structure.
   - Match the supplied hotel, contract, period, rooms, offers, rates, availability, minimum-stay, sale-state, and summary data.
   - Add normal and compact row modes with the exact 254px label column and 68px night cells on desktop, plus controlled horizontal scrolling on smaller screens.

2. **Calendar controls and lenses**
   - Add hotel, contract, and period pickers; search and room/meal-plan/status filters; changed-only, hide-past, and highlight-weekends controls.
   - Add the five connected views: Rates & availability, Children & occupancy, Restrictions, Sold, and Pickup.
   - Add the Needs you summaries, suggested actions, explanatory notices, and state legend shown in Figma.

3. **Editing states**
   - Support selection mode, individual-cell editing, row/day selection, rate and availability edits, minimum stay, booking cut-off, stop sale, and resume sale.
   - Represent no-rate, low inventory, sold out, stopped, past, changed, conflict, and read-only states with semantic design tokens.
   - Keep draft values separate from published values so agents continue seeing the previous values until publish.

4. **Bulk update and publishing flow**
   - Build the full-width side drawer for date range, rooms, offers, day selection, fixed/raise/percentage rate strategies, rounding, sale state, minimum stay, inventory, and cut-off.
   - Implement impact calculations, period splitting, review screens, validation and conflict states, discard, confirm, and publish confirmations.
   - Persist the current session’s draft and published changes across contract and calendar navigation.

5. **Connected overlays and secondary flows**
   - Implement hotel/contract switching, period selection, rate seasons, export view, On Request queue, and all referenced empty, loading, error, warning, success, and confirmation overlays.
   - Link every action back to the correct contract, room, offer, period, and calendar state.

6. **Verification**
   - Compare representative base, compact, changed-only, bulk-review, stopped/sold-out, and picker states against Figma.
   - Test English and Arabic, LTR/RTL, desktop/tablet/mobile layouts, keyboard behavior, state persistence, and unintended page overflow.

## Technical details
- Split the current calendar into focused toolbar, summary, lens, grid/cell, bulk editor, review/publish, picker, queue, and export components.
- Extend the shared portal state for room offers, sold/pickup/restriction metrics, On Request items, and separate draft/published overrides.
- Reuse existing shadcn controls and semantic tokens; add only missing calendar-state tokens to the global design system.
- Keep `/rate-calendar` as the main route and encode the active hotel/contract in validated search parameters so existing links remain valid.