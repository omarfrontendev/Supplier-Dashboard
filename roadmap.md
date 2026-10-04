# Hoteliana Supplier Portal — Final MVP (Figma node 2-7)

## Done
- Flow 01 — Access & account: login, activation, incorrect credentials, 2FA + error, forgot password, reset password + mismatch
- Getting started
- Agreement (read-only) + contract modal + document viewer
- Request company changes (3 fields) -> review -> submitted -> approved / not approved
- Hotel Library: search/filters, quick view drawer, request access + confirm + sent overlays
- Add a missing hotel: details -> duplicate check -> photos & amenities -> review -> sent
- My Hotels + hotel profile + add missing room drawer (similar-room warning, pending rows)
- Requests list + detail drawer (pending / needs you / approved / not approved)
- Top bar (logo, 6 nav items with icons, active = dark bg + #B8FF5A icon), tabs active = dark bg + white text
- AR/EN with Cairo (Arabic) + Readex Pro, automatic RTL/LTR

## Figma re-audit (MVP Final UI · node 2:7 · 315 frames / 14 sections)
Figma access is back. Auditing section by section, comparing every frame's
real text and data against the code and committing one flow at a time.

- [x] Flow 01 — Access & Account (73 frames)
- [x] Flow 02 — Hotels & Access (21 frames)
- [x] Flow 03 — Hotel supply contracts (46 of 48 frames). Left: REF 03.R
      (an engineering reference sheet, no UI) and OV 03.16M's charge-type
      menu, whose copy is in place but is not wired to a control yet.
- [x] Flow 04 — Rates & Availability (50 of 51 frames): base grid, the six
      contract shapes, the scheduled Ramadan Block with its unpriced rooms
      and the Not priced filter, the four months with their own chip counts
      and season hints, show rows/rooms/view, "+ meals", the colour key and
      threshold, and the draft, published and read-only states. Left: REF
      04.R, an engineering reference sheet with no UI.
- [x] Flow 05 — Bookings (18 frames)
- [x] Flow 06 — Change requests (21 frames). The design dropped commercial
      amendments: an amendment is now non-commercial only, and a longer
      stay is a new booking. The three commercial rows were removed.
- [x] Flow 07 — Finance (20 frames) — statement, STATUS column, negative
      balance (UI 07.0D at `?state=negative`), row actions (OV 07.10),
      contact and note (OV 07.12 / 07.13), the dispute overlay and its two
      evidence states (OV 07.14 / 07.14A / 07.14E), the payments list and
      payment PAY-014.
- [x] Flow 08 — Team, Access & Activity (18 frames) — the people table with
      its own reach chips, the Roles tab (UI 08.20 / 08.22 at `?tab=roles`
      and `?state=created`), the Admin view (`?as=admin`) and the activity
      log with its pager and "Not your team" filter.
- [x] Flow 09 — Dashboard (8 frames) — the seven ranked cards with their
      own copy and actions, the five role variants including the front
      desk's day, the all-clear state (`?state=clear`) and the analytics
      numbers, chart notes and three recommendations.
- [x] Flow 10 — Business exceptions (14 frames) — the four contract states
      (`?exception=ending|ended|paused|terminated`), the pauses and the
      17-row blocker engine, the fulfilment case under review and closed,
      the information requests and their all-clear state.
- [x] Flow 11 — System & empty states (23 frames) — the eight cases and
      their four detail views, every denial, failure, conflict and
      sign-out with its own cause, the four empty states and the inbox
      settings.
- [x] Chrome — shared top bar (4 frames) and Components (2 frames) — the
      account menu with its five destinations and hints (OV CH.4) and the
      language menu with both options and the layout note (OV CH.3).
- [x] Re-verify every flow at desktop and mobile sizes in English and Arabic
      — 25 routes answer 200, and the screens rebuilt in this audit have no
      horizontal overflow at 375px in Arabic RTL.

### States reached by a search parameter
- `/hotels?state=first` — UI 02.1, the first visit, where nothing is linked
  yet and every card can be picked. `/hotels` stays on UI 02.7, the
  returning supplier, which is what the six cards' relationships draw.

### Design inconsistencies, now rendered as Figma draws them
Every number and label below is held as data and printed the way the
design prints it, even where it does not follow from the rows beside it.
They are listed so the designer can reconcile them at the source.

- UI 03.0 — tiles: 3 contracts across 3 hotels, 24 rooms on sale,
  2 contracts with 4 issues, 2 stock alerts.
- OV 03.0E — status counts 7 / 2 / 1 / 1 / 1 / 1 / 1, and the note that
  Expired and Terminated are hidden by default, while UI 03.0 lists all
  seven including both.
- UI 04.1 — toolbar counts (sold out 1, 4 or fewer 1, on request 2).
- OV 04.4 — the closing line "More nights or rooms? Use Stop sale / On
  Request in the toolbar" is drawn with a checkbox beside it, although it
  reads as a hint and has nothing to switch on.
- OV 04.6 — the pool reads 50 rooms, 50 sold and 0 left, while OV 04.5
  calls the same contract's night "2 left of 50 · 48 sold".
- OV 04.4F — the closing line ends "in the tool" where OV 04.4 reads
  "in the toolbar".
- OV 04.1VF — the fixed-price twin prices Lines, but its two error
  lines still say "room" and quote "All selected rooms".
- OV 04.2 / 04.3 / 04.1A — Flow 12 Row J replaced the From and To boxes
  with one "Pick nights" field, but the empty line under it still reads
  "pick From and To, choose the days, then Add."
- OV 08.25 — the frame writes "She gets the change on her next page load"
  about Layla. The line is a template over whoever holds the role, so it
  reads "They get the change on their next page load".
- OV 01.6A-L — the document opened while accepting v1.4 is the same
  preview OV 01.6A draws, and it still names Supplier_Agreement_v1.3.pdf
  while the sheet above it names v1.4.
- UI 04.1 — Readex Pro measures about 4% wider in a browser than in
  Figma, so a room's 10px note ("base + 120 · weekday 520 · weekend 620")
  overflows the 194px label column that the frame fits it into. The notes
  carry -0.04em of tracking so the grid breaks its lines where the frame
  breaks them.
- UI 05.0 — chips 47 / 2 / 38 / 3 / 3 / 1 / 1 / 1 and a 47-booking list
  across three pages, beside 18 drawn rows.
- OV 05.15 — the hotel menu counts 41 + 5 + 2 and calls the three of them
  "48 bookings", while UI 05.0's All chip counts 47.
- UI 06.0 — the pill reads "2 waiting on you" while four rows need one.
- UI 07.0D — HTL-88198 reads "Stay · one night added", though Flow 06
  dropped commercial amendments.
- UI 07.6 — the second column is headed "GUEST" but prints the movement
  kind; the guest name sits under "WHAT IT IS".
- UI 08.0E — Tariq's row is Active and still carries "INVITE EXPIRED".
- UI 08.9 — chips read "All areas 14" and the footer "Showing 1-20"
  beside 16 drawn lines.
- UI 08.20 — the Roles tab omits Front office and gives Finance
  "2 people", while the People table shows one of each.
- UI 09.0 — "OF WHAT YOU OPENED, SOLD 71%" against 1,236 sold and 1,011
  that never reached an agent.
- UI 09.1 — "18 rate changes are not published" beside a team card that
  says 3, and an activity log that logs 3.
- UI 11.16 — "Four requests, three different states" above four rows in
  two states.
- UI 01.6 vs UI 01.6C-* — the same record differs between the profile
  and the change frames. Each screen now prints its own frame's values:
  the profile reads "Jewar Al-Safwah for Travel & Tourism",
  "registered@jewaralsafwah.com" and "Registered company owner"; the
  change frames read "Jewar Al-Safwah Travel & Tourism Co.",
  "info@jewaralsafwah.com", "Abdullrahman Najeh" and an Owner_ID.pdf.
- Flow 10 — the contract exception frames carry their own contracts
  (Hilton Makkah, Swissôtel Al Maqam, Movenpick City Star) rather than
  the UI 03.0 list, and are rendered from that data at `?exception=`.
- OV 01.6A2 — the pager chevrons keep page 1's colours: Previous stays
  grey and Next stays green, although the frame names them
  "Previous page" and "Next page (last)". The code follows the names and
  disables Next on the last page.
- UI 03.1F — Live summary reads "40 rooms / night" while the Inventory
  field beside it reads "50 rooms / night". The code keeps the summary
  derived from the field, so the two agree on screen.
- UI 03.1A/F — the Rooms table drops the separator on two rows only:
  "Deluxe Room City View" and "Deluxe Room Partial Haram View", while
  every other row reads "Type · View". The code keeps the separator.
- UI 03.1B/B2, 03.1M, 03.1Q — each variant is drawn with its own
  contract rather than the same one toggled: On Request uses Central
  Haram / Umrah Q4 / 3 rooms / 92 nights, One price all week drops the
  Triple and Quad rooms, and the None frames carry no seasons. The code
  keeps whichever contract is on screen and changes only what the toggle
  governs.
- UI 03.3 — the contract page reads "Shared pool · 50 / night" for
  Makkah Annual Block while UI 03.0 lists the same contract as
  "40 / night · 3 types". The code keeps 40, the figure the contract
  itself carries.
- OV 03.16SLTN / SHAJ / SSUM — all three carry Ramadan's title
  ("Cancellation policy for Ramadan") and Ramadan's dates in the closing
  line ("Outside 18 Feb - 09 Mar"), although each names its own season in
  the overline and its own dates in the body. The code follows the season
  each panel is for.

## Flow 10 — Business exceptions (23 Figma frames)
- [x] Contract ending, expired, Hoteliana-paused, and terminated states
- [x] Sell-status pauses, follow-up, blocker groups, full-night check, and code reference
- [x] Confirmed-booking fulfilment incident report, review, and closed finance outcome
- [x] More-information document requests, upload, review, rejection, and history
- [x] Verify desktop/mobile, English/Arabic, interactions, and page overflow

## Flow 09 — Dashboard (16 Figma frames)
- [x] Build role-aware What needs you screens for Owner, Revenue manager, Reservations, Finance, and Front office
- [x] Build Analytics KPIs, charts, heatmap, outcomes, money view, and insights
- [x] Implement period/comparison/hotel scope, chart data, CSV export, and linked actions
- [x] Add bilingual EN/AR copy, Cairo RTL layouts, route metadata, and responsive views
- [x] Verify at 1280px and 393px without console errors or page overflow

## Flow 08 — Team, Access & Activity (29 Figma frames)
- [x] Build the team overview, exact member dataset, summaries, status filters, responsive people list, and role matrix
- [x] Implement invitations, resend/cancel/expired states, role selection, and permission previews
- [x] Implement member management, role changes, Auditor reach, deactivate/reactivate, and owner protections
- [x] Implement ownership transfer review and completion states
- [x] Build the immutable activity log with search, filters, export, details, and linked records
- [x] Give every person their own reach chips and role label, and seat Tariq Bin Saleh on the expired invitation
- [x] Add the People / Roles tabs, the role catalogue and the role-created state (UI 08.20 / 08.22)
- [x] Add the Admin's view of the same page (UI 08.0E)
- [x] Match the log lines to the design and replace Load more with the pager and per-page control
- [x] Add the "Not your team" and one-person filters to WHO (UI 08.9B / 08.9D)
- [x] Add bilingual EN/AR copy, Cairo RTL layouts, route metadata, and responsive desktop/mobile views
- [x] Verify all 29 states and interactions at 1280px and 393px without console errors or page overflow

## Flow 06 — Booking change requests (27 Figma frames)
- [x] Build the change-request queue, urgent cards, type views, search, filters, sorting, export, and row actions
- [x] Add the exact eight-request Figma dataset and connect every request to its booking
- [x] Implement whole, partial-room, and shortened-stay cancellation decisions with full, reduced, and waived charges
- [x] Implement commercial amendments with system-price approval, custom quote, agent-waiting, approval, and decline states
- [x] Implement quote-requested and non-commercial guest-name amendment states
- [x] Persist booking versions, inventory impact, financial state, audit events, and issue reporting in shared session state
- [x] Add bilingual EN/AR copy, Cairo RTL layouts, route metadata, and responsive desktop/mobile views
- [x] Verify all 27 states and interactions at 1280px and 393px without console errors or page overflow

## Flow 05 — Bookings (Figma node 523-3213)
- [x] Build the bookings workspace with attention cards, status counts, search/filter/sort controls, export, and the exact eight-row Figma dataset
- [x] Build the booking detail route with shared booking, guest, stay, rate, calendar-impact, special-request, and outcome sections
- [x] Implement On Request decisions: countdown, confirm with or without hotel reference, reject with reason, and expired read-only state
- [x] Implement confirmed booking states: reference pending, add confirmation number, completed confirmation, and calendar-allotment impact
- [x] Implement cancellation and amendment request review states and their approve/decline confirmations
- [x] Implement Report an issue drawer and sent confirmation while keeping confirmed bookings unchanged
- [x] Connect Bookings in the top navigation and all list/detail/actions, with Arabic/English, RTL/LTR, and responsive layouts

## جولة الـUX (Sonner + Skeleton + Loading + تفضيلات)
- [x] Sonner بتصميم النظام + توستات لكل أكشن (دخول، رمز، كلمة مرور، طلب وصول، تعديلات، فندق، غرفة، صور)
- [x] Skeleton في: مكتبة الفنادق، فنادقي، الطلبات، الاتفاقية، ملف الفندق
- [x] Loading على كل زر ينفذ أكشن
- [x] بحث في كل Select + وضع بحث عبر API (`loadOptions`) مطبّق على مدن إضافة فندق
- [x] تفضيل عرض تسميات التنقل محفوظ في localStorage
- [x] تجاوب: الشريط العلوي، التبويبات، رؤوس الصفحات، الشبكات

## Flow 03 — Rate contracts (Figma node 523-3211)
- [x] Restore shared Property tabs and remove provisional Rate contract sub-tabs/pages
- [x] Rename the commercial entity to Supply contract and align visible IDs
- [x] Match the supply-contract list states and state-specific actions
- [x] Match the 10-section create/edit page structure and connected publish flow
- [x] Add bilingual copy and shared in-session contract state
- [x] Verify desktop, tablet, mobile, RTL, and all interactions

## Flow 04 — Rate Calendar (Figma node 523-3212)
- [x] Move Rate Calendar to its own main navigation section
- [x] Add hotel/contract/date controls and interactive rate/inventory grid
- [x] Add selected, low inventory, stop sale, weekend, and today cell states
- [x] Bulk edit panel (rate / availability / min stay / stop sale) applied to selected cells
- [x] Hotel + contract selectors driven by shared supplyContracts data; rows in Rate contracts link to the calendar
- [x] Verify and implement Rate & Availability edit, stop-sale, resume, save confirmation, and persisted in-session states

## Flow 04 — Detailed Rate & Availability states (50 Figma frames)
- [x] Rebuild the 16-night room/offer grid with exact Figma data, availability rows, rate states, compact mode, and responsive horizontal navigation
- [x] Add search, room/meal/status filters, changed-only/hide-past/weekend toggles, five data lenses, summaries, legends, and suggested actions
- [x] Implement cell selection and inline edit states, including no-rate, low inventory, sold out, stop sale, past night, edited, and validation/conflict states
- [x] Implement the full bulk-update drawer variants, day/rate strategies, impact calculation, review, discard, publish, and persisted draft/published states
- [x] Implement hotel/contract/period switching, rate seasons, on-request queue, export, and all linked confirmation/error/empty states
- [x] Match English and Arabic layouts and verify desktop, tablet, mobile, RTL, keyboard interaction, and no unintended page overflow

## Flow 07 — Finance (20 Figma frames)
- [x] Build the running account statement with exact 11-movement dataset, totals, balance directions, and movement filters
- [x] Connect finance movements to booking details, change requests, entries, and payments
- [x] Implement entry drawers for charges, credits, and non-booking adjustments
- [x] Implement movement breakdown, row actions, search, advanced filters, and account export
- [x] Build payments list and payment detail with covered movements and remittance advice download
- [x] Implement contact/note workflow and sent confirmation without changing the financial balance
- [x] Add Hoteliana-owes-you and you-owe-Hoteliana account states
- [x] Print the STATUS column (Pending / Settled / Disputed) the design draws
- [x] Rebuild the row-actions menu with the hint line under every item (OV 07.10)
- [x] Add the dispute overlay with attached and rejected evidence (OV 07.14 / A / E)
- [x] Carry the real bank transfer references (TRF-99120-…) through both payment screens
- [x] Add bilingual EN/AR copy, Cairo RTL layouts, route metadata, and responsive desktop/mobile views
- [x] Verify all linked states at 1280px and 393px without console errors or page overflow

## Flow 11 — System & empty states
- [x] Notifications drawer, tabs, thread, delivery details
- [x] Notification preferences
- [x] Permission and session states
- [x] Save, publish, and conflict states
- [x] Contextual empty states
- [x] Ask Hoteliana and support cases
- [x] EN/AR and desktop/mobile verification

## Portal-wide rules from `docs/front-end-states.md`

The specification's sections 0.4, 0.5 and 0.6 apply to every screen, not to a
frame. What is built, and what the designer still has to settle.

- [x] §0.6 — one status table (`src/lib/status-tones.ts`). `StatusPill` takes a
      `status` and paints itself; a name the table does not list renders no
      badge at all. The 20 Sep renames are applied: `In force` → `Active`,
      `Not approved` → `Rejected`, `Stop sell` → `Stop sale`.
- [x] §0.5 — permission keys (`src/lib/permissions.ts`) and "hidden, not
      disabled" (`<Gated>`). Refusals map to UI 11.4 / 11.5 / 11.6 / 11.14.
- [x] §0.4 — `<DataStates>` carries loading, loading-after-filter, empty,
      no-results and load-failed on any list; `usePagedList` keeps the page
      and the rows-per-page in the URL; `exportRows` emails an export over
      5,000 rows.
- [ ] §0.4 — `<DataStates>` is on the bookings list. The other lists already
      carry empty and no-results states of their own, several of them better
      than the generic one — the contracts list names the active filters back
      to you. What they are missing is loading and load-failed, and those are
      worth adding when the screens fetch rather than read a constant.
- [x] §0.5 — contract create, edit, amend, pause, stop sale, duplicate and
      terminate. In a menu, a refused action is not listed at all: there is
      no room for a line naming who can, and a greyed row with no reason is
      exactly what BR-00-22 forbids.
- [x] §0.2 — closed nights are dropped from a picked range, and the
      summary says how many.
- [x] §0.7 — one blocker table (`src/lib/blockers.ts`) with the eighteen
      REF 10.C codes, BR-10-29's badge priority and BR-10-28's three
      sections. The sell-status rows read it instead of naming their own.

### Contradictions to settle with the designer

- **§0.1 says the MVP is English only**, but the portal is fully bilingual and
  Arabic is being written for every screen. Confirmed on 27 Sep 2026 to keep
  Arabic; the specification line stands unresolved.
- **REF 00.S is missing two statuses the booking frames draw**: `Reference
  pending` and `Issue reported`. The drawn wording is kept and the colour is
  taken from the family the table does list (warning, danger). UI 04.1 also
  writes `Ended 19 Sep 2026`, which the table calls `Expired`.
- **REF 08.R says 31 permission keys.** 27 are named in the specification or
  ticked in OV 08.21; the four contract actions (create, edit, publish,
  terminate) are inferred from the built screens. The exact list needs the
  REF 08.R page.
- **Rows per page**: §0.4 proposes 25, marked مقترح; the frames draw 20. The
  drawn number stands and 25 was added to the menu.

## Flow 00, from `docs/guide/flow-00.md`

- [x] BR-00-07 — the drawer closes with ✕ only; the scrim was closing it.
- [x] BR-00-08 — the modal closes on Cancel, ✕ or Esc, and on a click outside
      only when nothing has been typed. Neither overlay handled Esc.
- [x] BR-00-20 / BR-00-21 / BR-00-22 — permission keys, hidden not disabled,
      and a disabled button that says why.
- [x] BR-00-27 — one badge component, five colours; an unlisted status is
      written as plain text rather than badged grey.
- [x] BR-00-02 — `priceLabel()` and the `· incl. VAT` suffix on the price
      labels the built screens show.
- [x] BR-00-02 — the rest of Flow 12 Row D, about 114 screens. Built
      since; every screen on the Flow 12 list now exists.
- [x] BR-00-09 — the "Discard changes?" guard, and `useDiscardGuard` to
      wire an overlay to it in a line.
- [ ] BR-00-10 / 11 / 12 / 13 — the four save states kept apart, the draft
      written every 10s and on blur, `Idempotency-Key` on every batch, and a
      `version` on every record so a stale save is refused with a diff.
- [ ] BR-00-14 / 15 — conflicts resolved cell by cell, and inventory never
      resolved automatically.
- [x] BR-00-17 — the session ends at 30 minutes idle with the OV 11.30
      warning at 28, a live 2:00 countdown, and one idle clock shared across
      the browser's tabs. Reach it with `?idle=warning`.
- [ ] BR-00-17 — the twelve-hour ceiling is counted but nothing renews a real
      session, because there is none to renew yet.
- [ ] BR-00-23 — `permission_version` on the session, re-read when it changes.
- [x] BR-00-24 — the bookings search stops matching on a guest name the
      viewer may not see. Hiding the column while leaving it searchable
      hands the name back.
- [ ] BR-00-24 / 35 — the same rule on notifications and emails, and every
      export logged with whether it carried PII.
- [ ] BR-00-28 / 29 / 30 — "Needs you" is `requires_action`, leaves for the
      whole team at once, and repeated events update one thread.
- [ ] BR-00-33 / 34 — the activity row's full shape, and the fields the log
      must never store.

## Flow 12 · Row G — the Win list

Built from `docs/guide/flow-04w.md`, the chapter Flow 12 added on 26 Sep.

- [x] UI 04.W — the weekly list, the three KPIs, and a row per line.
- [x] UI 04.W0 / 04.W1 — off, and on request with `Get my list now`.
- [x] OV 04.WA — apply as a draft, with A9's weekday/weekend split, the
      nights already at or below the target, and A10's fixed nationality.
- [x] OV 04.WD — dismiss with an optional reason, undoable for ten seconds.
- [x] OV 04.WS — every week, only when I ask, off.
- [x] BR-04W-05 / 06 — bands only. No competitor name, no competitor price,
      no numeric rank anywhere on the screen.
- [x] Entry point 1 of 5 — the header button on UI 04.1.
- [x] Entry point 3 — the in-app notice, as information rather than an
      action, since BR-00-28 reserves “Needs you” for `requires_action`.
- [ ] Entry point 4 — the dashboard card, which the guide marks مقترح.
- [ ] E8 — two users applying the same line; the second needs the server to
      say so.
- [ ] BR-04W-10 — lines expiring after 7 days, which needs a real clock.

## Flow 12 · Row E — the confirmation number, per room

- [x] OV 05.2 — three modes: one per room (the default), same for all rooms,
      and not issued yet.
- [x] The field rules: 1-40 characters, letters, numbers and `- / _ .`; the
      Hoteliana-reference mistake; the duplicate that warns without blocking;
      and a saved number that cannot be emptied.
- [x] OV 05.10 — the same component for adding the numbers later.
- [ ] The row and the drawer still print the joined string; the frames may
      want one line per room.
- [ ] The duplicate check is against the bookings in the browser; the real
      one belongs on the server, across the whole hotel.

## Flow 12 · Row C — nationality prices in seasons

- [x] OV 03.12N / N0 — the tab on the season panel, empty and with groups,
      and the `All other nationalities · Season prices` row that is always
      last.
- [x] OV 03.12NA / NE — the drawer's three steps: who pays, how the price
      differs (adjust the season, or a fixed price per room), and the price
      table that fills in as you type.
- [x] BR-03-93 / OV 03.12NX — a country belongs to one group per season, and
      a clash names the group that already has it and stops the save.
- [x] BR-03-96 — a group price under the room's own floor warns per room and
      still saves; ten groups warns and still saves.
- [x] The remove confirm no frame draws.
- [x] The Review & publish line, so publishing a season price never hides
      the fixed group that did not move with it.
- [ ] A room added to the season after a fixed group exists falls to the
      season price and needs its warning.
- [ ] BR-03-95 — the booking snapshot has to record which nationality price
      was applied.

## Flow 12 · Row F — finance rebuilt on the statement

- [x] OV 07.D — the eight-item finance menu, and every page hanging off it.
- [x] UI 07.20 — the Overview, with payments paused, owing Hoteliana, and
      nothing due yet reachable as `?state=paused|owed|nothing`.
- [x] UI 07.22 / 07.23 — the statements list and one month in full: the five
      kinds of line, the one sum, accept, accept the rest, and dispute.
- [x] BR-07-28 / 30 / 31 — acceptance is final, a dispute never stops the
      rest, and the window closing takes the buttons with it.
- [x] UI 07.21 Earnings, 07.33 Adjustments, 07.34 Tax invoices, Reports, and
      07.36 Bank & payment terms.
- [x] BR-07-06 — the running-account wording that survived in the payments
      copy, including "there is no cycle and no promised date", which the
      new model flatly contradicts.
- [x] BR-07-05 — an old link lands on the page that replaced the screen,
      through the router's own `defaultNotFoundComponent`.
- [x] UI 07.32 / 07.32R — the payments list and the remittance advice both
      run on the frames' own rows now.
- [ ] BR-07-14 / 15 / 16 — the daily run for On arrival and On booking, the
      no-show cut-off at 18:00, and the refund owed after a paid booking is
      cancelled.
- [ ] BR-07-49 — the invoice comparison is seeded, not computed.
- [ ] Q1 in the guide: UI 07.23B / E / F print numbers that do not add up
      (18,450 − 560 = 17,890). The designer flagged it themselves.

## What a front end cannot finish on its own

These are written down so nobody looks for them in the code and concludes
they were missed. Each needs a server, a clock, or both.

- **BR-00-10 / 11 / 12 / 13** — the four save states kept apart, a draft
  written every ten seconds and on blur, an `Idempotency-Key` on every batch,
  and a `version` on every record so a stale save is refused with a diff.
- **BR-00-14 / 15** — conflicts resolved cell by cell, and inventory never
  resolved automatically. The screens exist; the conflict has to come from
  somewhere.
- **BR-00-23** — `permission_version` on the session, re-read when it changes.
  A revoked permission has to bite on the next request, not the next sign-in.
- **BR-00-33 / 34** — the activity row's full shape, and the fields the log
  must never hold: no passwords, no session ids, no tokens, no full IBAN.
- **BR-04W-10** — Win list lines expiring after seven days.
- **BR-07-14 / 15 / 16** — the daily run for On arrival and On booking, the
  no-show cut-off at 18:00 Makkah, and the refund owed when a paid booking is
  cancelled.
- **BR-07-49** — comparing a tax invoice's buyer name, VAT number and total
  against the statement. The states are drawn; the comparison is seeded.
- **OV 05.2** — the duplicate confirmation-number check runs against the
  bookings in the browser. The real one is per hotel, on the server.
- **Flow 04-W entry point 2** — the Monday 06:00 email.

## Open questions for the designer

- **Q1 (the guide's own)** — UI 07.23B / E / F print numbers that do not add
  up: 18,450 − 560 is 17,890, not what the frame shows.
- **§0.1** says the MVP is English only; the portal is bilingual and Arabic is
  written for every screen. Confirmed on 27 Sep 2026 to keep Arabic.
- **REF 00.S** is missing `Reference pending` and `Issue reported`, which the
  booking frames draw.
- **REF 08.R** says 31 permission keys; 27 are named in the specification or
  ticked in OV 08.21, and four contract actions are inferred.
- **Row E** — the row and the drawer print the per-room numbers joined into
  one string. The frames may want a line each; Figma was not readable when
  this was built.

## Flow 04 and Flow 10, checked against the guide

What the audit found, and what it did not.

- [x] The filter row is seven, fixed. `Not priced` used to vanish at zero
      while `Stop sale` stayed and showed its 0, so the row changed shape
      for no reason.
- [x] OV 10.6 — the four reasons Flow 12 settled on (BR-10-37) replace the
      old `No availability / Rate error / Other`. A rate error is a finance
      dispute, not a fulfilment incident, and “no availability” hid three
      different problems. `Guest nationality differs` is the reason Flow 12
      added, and it carries its own consequence: the agent pays the price
      difference.

Checked and already right, so nothing was changed:

- Show rows, Show rooms, Compact rows, Hide past nights, Pickup · last 7
  days, Select cells.
- The colour key, including “Almost gone” with the number the supplier
  chooses.
- Contract, hotel and month pickers, and `Include ended contracts`.
- The five Flow 10 situations all have screens, and Cases states BR-00-32's
  rule on the page: a case never closes silently.
- Every out-of-scope rule holds: no Cancel on a confirmed booking anywhere,
  the supplier cannot lift a Hoteliana pause (`HOTELIANA_PAUSED` offers
  “Open the pause”, never “lift”), no performance score, and the portal
  says outright that Hoteliana never asks for your contract with the hotel.

- [ ] The `Relocated` and `Replaced` outcomes of an incident, which the
      guide marks as not drawn.
- [ ] A pause on stay nights only, more than one pause on the same thing,
      and a case closed without an entry - all also not drawn.

## OV 07.D · the finance mega menu

The guide draws it exactly (§3 of Flow 07): "بيدوس على Finance → بيفتح OV
07.D تحت الزرار فيه 8px ومحاذي ليه. 3 مجموعات MONEY و DOCUMENTS و
SETTINGS".

- [x] Finance opens the menu on every screen and never a page. The Overview
      is reached by choosing Overview inside it.
- [x] 8px under the button, aligned to its edge - measured, not eyeballed.
- [x] Three groups: MONEY, DOCUMENTS, SETTINGS.
- [x] The current section is marked `active`, so no finance page needs tabs -
      and none has them any more.
- [x] Badges: Statements by how many need review, Tax invoices by how many
      are missing, Adjustments by entries against you nobody opened, and the
      total on Finance in the bar.
- [ ] The red “!” on Payments when a transfer comes back. The badge shape is
      there; a bounced payment is a server event.

## Read from Figma at last

The desktop Figma connection works, so Flow 12 (node 3662-62744) is
readable: **172 screens**. What had been built from the guide alone can now
be checked against the frames.

### OV 07.D, corrected against the frame

Built blind it was close in structure and wrong in almost every dimension.

| | Frame | Was |
|---|---|---|
| Panel | 340 wide, one column | 600, two columns |
| Radius / shadow | 14px, `0 10px 30px rgba(0,0,0,.14)` | 16px, shadow-overlay |
| Item | 18px icon, gap 12, py 10, radius 10 | no icon, px 2.5 py 2 |
| Title / hint | 13.5px Medium / 11px Regular | 13px SemiBold / 11.5px |
| Badge | pill, 12px Medium, px 10 py 4 | 10px, px 1.5 py 0.5 |
| Between groups | a 1px rule | nothing |

And every hint was different. The frame's say more than the guide's
summaries did - “Every booking and the day it is payable” tells a supplier
something that “by payment term” does not.

- [x] The eight icons are the exported assets, committed under
      `public/icons/finance/`.
- [x] **Payments has no visible icon**: the frame leaves that row on the
      icon component's default variant, which is a **white** tick, invisible
      on a white panel. Drawn as drawn for a while, then given one - a note
      and a coin, in the same hand as the rest of the set. The designer may
      still want their own; the row is no longer the only one without a mark.
- [ ] `#6b7a70` is unbound in Figma - it sits between `text-secondary` and
      `text-muted`. Added locally as `--text-quiet`; it wants a real variable.

### UI 04.W, corrected against the frame

| | Frame | Was |
|---|---|---|
| Row | hotel above, room · board below | room above, hotel below |
| Demand | plain text + “N of your bookings” | a pill |
| Position | pill; Top 5 is **warning**, not neutral | Top 5 neutral |
| Target | “540 or less”, bare | “540 SAR or less” + a “now” line |
| Actions | Apply then Dismiss, both outline | Dismiss then Apply, Apply solid |
| Middle KPI | tinted `#edffd6` | plain |
| Footer | grey note, then a blue `#e8f1f8` panel | two grey lines |

The subtitle and both footer sentences were the guide's paraphrase; they
are now the frame's own, and the second one is the promise that matters:
“We never show other suppliers or their prices. You decide - nothing
changes until you publish.”

### UI 07.20, corrected against the frame

The Overview was the furthest from its frame, because it had been built
from a guide section that described the finance *model* rather than this
page. The frame answers four questions in the order a supplier asks them,
and the page is now those four.

| | Frame | Was |
|---|---|---|
| Title | “Finance overview” + a “Next payment 16 Oct” pill | “Finance” |
| Tiles | **four**: next payment, due to you, you owe, statement to review | three |
| Tints | first green `#edffd6`, last amber `#fff1d6` | one green |
| NEEDS YOU | a card, two amber banners, two buttons | a line in a tile |
| COMING UP | a table: date, what, term, amount, status, Open | absent |
| PAYMENT TERMS | three contracts and the sentence each pays by | a link to Bank |
| Header right | Reports, Export | nothing |

`--text-body` was `#4f5c57`; Flow 12 prints body copy at `#41544a`
throughout, so the token was stale and is now the design's value.

### UI 07.23, corrected against the frame

| | Frame | Was |
|---|---|---|
| Lines | **two tables**: bookings, then penalties and deductions | one table, five groups |
| The sum | **four tiles** above them | a total row underneath |
| Tints | deductions pink `#fdeceb`, amount due green `#edffd6` | none |
| Cycle | a blue strip: “How this statement works” | a footnote |
| Filters | hotel and contract | none |
| Tax invoice | its own card with an amber banner | a row |
| Payment | its own card: date, bank, status | absent |

The split is the point: bookings are what the month **earned**, penalties
and deductions are what was **added to or taken from** them. They are
different questions and the frame gives them different tables.

The list and the detail used to print different totals for September -
16,500 against the frame's 18,450. They now read one number.

### UI 07.23A-F and P1-P3, built from the frames

Nine frames, but not nine screens. A to F are one month with three things
changed - the chip beside the title, the band that replaces the blue strip,
and what the disputed line and the amount-due tile say. Everything else is
untouched, and that is the design's argument: **a dispute annotates a
statement, it does not rebuild one.** They are reachable as `?state=`.

- [x] **The band takes the strip's place.** While September is open, the
      blue strip explains the cycle; once it has an ending, the ending
      replaces it. Being told how the cycle works is no longer the thing you
      need. Green for accepted and auto-accepted, amber for anything a
      dispute touched - and the frames keep it amber whichever way the
      answer went, because the line was argued either way.
- [x] **The tax invoice card is a prompt or a record**, and one rule covers
      all nine frames: while the money has not moved and nothing is on file
      it asks for one; otherwise it shows what is on file - invoice, check,
      who uploaded it and when. BR-07-45 is why it is never a gate.
- [x] **P1-P3** add August, July and June. July and June have no penalties
      at all, and the frame answers that with a sentence, not an empty
      table. August is paid and still missing its invoice - the two are
      unrelated, which is the point of drawing it.
- [ ] **The 560 goes the wrong way.** B, E and F all print 17,890 - the
      statement's 18,450 less the 560 - although the dispute asks for 560
      *more*, and E says the 560 is added to October on top. Three frames
      agree with each other, so 17,890 is what is drawn. For the designer.
- [x] **BR-07-47 against UI 07.23B.** The rule says uploading waits for the
      statement to be final; the frame draws the button with a line still
      under review. The frame is right - what is asked for is the invoice
      for the amount being paid, and by then that amount is settled. The
      button now appears as soon as the window has produced an answer, and
      only the untouched open month is without it.
- [x] **One separator.** The tiles printed 18,450 through `en-US` while the
      tables printed ١٨٬٤٥٠ through `ar-EG`. Same page, two ways of writing
      money. The tiles now use the tables'.
- [ ] F's chip is neutral where A and E are green. Drawn, not explained:
      nothing was won, but the statement still stands. For the designer.

### OV 03.15F / 03.16F / 03.17F, every season prices itself

Opening any season on a fixed-price contract showed the **contract's**
prices and one season's policy, whichever season you opened. Four frames
of the same screen, four different sets of numbers, and we drew one.

- [x] **The gaps hold.** Across all four frames each line sits the same
      distance above the base in a season as it does in the contract -
      +90 for breakfast, +240 for half board and a Haram view, and so on.
      So a season's base moves the whole table with it, and that is the
      rule the editor uses rather than four hand-written tables.
- [x] **A season's cancellation policy is its own.** Ramadan sets one,
      Hajj sets a harder one, the last ten nights and summer keep the
      contract's - and the editor says which, because a season silently
      showing another season's policy is worse than showing none.
- [x] The prices are written in the reader's digits and currency; the
      computed ones had come out as "640 SAR" inside Arabic.

### OV 03.12B, a season on a fixed-price contract

The fixed-price season editor existed and could not be reached: the
contract page never told it which model the contract used, because the
model was not in the contract data at all. Every contract said "Base +
supplements", whatever it actually was.

- [x] **A contract now carries its pricing model**, fixed for its
      lifetime, and `SC-2026-0155 · Al Noor Fixed` is the fixed one - the
      same contract the rate calendar already knew as fixed-price, which
      was missing from the contracts list entirely.
- [x] **The season follows its contract.** A season cannot change the
      model, so the editor is told rather than asked.
- [x] **Three lines that assumed supplements** now have fixed-price twins:
      the section description, the model value and the note under it. A
      page that says "Fixed price per room" and then explains supplements
      underneath is worse than one that says neither.
- [x] `+ Add room` is filled: it is the thing to do there, and requesting
      a missing room is the exception beside it.

### OV 02.2, the hotel quick view

The frame annotates itself `CHANGED · read-only licence line in the
official profile`, and that line was the whole of the change.

- [x] **The tourism licence, with its expiry**, now sits in the quick view
      beside the address and the distance. It is what makes the profile
      official rather than claimed, and the one line here that can expire -
      so it belongs before someone asks for access, not after.

### UI 02.2L, the linked hotel's room catalogue

- [x] **Two pills, not one.** "Approved & linked" was one badge saying two
      things, which hides the case where a hotel is linked and not
      selling. The frame draws `Linked` and `Selling` separately.
- [x] **"Official", not "Available".** The catalogue is Hoteliana's own
      record of the hotel's rooms; whether a room is available is a
      different question, answered on a different page. A pending room
      reads "Waiting for Hoteliana", which says who is holding it.
- [x] **The images column goes.** The frame does not draw it, and the
      table is answering what a room *is*, not how well photographed.
- [x] "١ / 12 صورة" had Arabic digits on one side of the slash and Western
      on the other.

### UI 02.8 / 02.8H / 02.8B / 02.8B2, adding a missing hotel

The wizard was already built and close. Three things the frames carry that
it did not:

- [x] **The closest match gets the filled button.** Two candidates drawn as
      equals decide nothing; the frame fills `Request access instead` on
      the 91% match and leaves the 82% quiet. Each row also gets the
      library's own thumbnail, so it is recognised before it is read.
- [x] **The rating names its source** - "4 stars · Official (Ministry of
      Tourism)" - because a star count nobody issued is a claim.
- [x] **Continuing past a duplicate is amber on the review.** It is the one
      line on that page someone may later have to answer for.
- [x] **Arabic agrees the verb, not only the noun.** "2 فنادق ... تشبه"
      was wrong twice over; the dual wants "فندقان ... يشبهان", so the
      whole sentence is chosen by count rather than a number slotted into
      one.

### UI 05.11C, a cancelled room and a number that went void

The agent can cancel one room of a confirmed booking. The room stays on
the booking, struck through, and its confirmation number goes void.

- [x] **Struck, not removed.** The room was really booked and the charge
      on it is really owed - the booking details carry a cancellation
      charge line for exactly that reason. Deleting the row would hide a
      number that is still on somebody's paperwork.
- [x] **The blue band says what void means**: the number no longer shows
      on the voucher or in Masar, and one room a night went back to the
      allotment. Without it, a struck-through number is a puzzle.
- [x] **Nothing left to do** replaces "one thing left" when nothing is
      owed, and says why - the agent has it, the calendar is updated, and
      if something goes wrong it is an issue to report, not a booking to
      cancel.
- [x] The room line takes the short name from the offer in both languages;
      it had been printing the bed layout too.

### UI 05.4P, one of two rooms has its number

A number per room means a booking can be part-way, and the page had no
such state: any number at all counted as complete. A two-room booking with
one number was being shown as finished.

- [x] **Counting, not guessing.** The numbers are counted against the
      rooms. A booking whose single number covers every room says so
      (`sameNumber`), because otherwise one number on two rooms is
      ambiguous - it could be the only one that came, which needs chasing,
      or the only one there will ever be.
- [x] **The chip and the banner** say how far along it is: `1 of 2 numbers
      in`, and "Room 1 is on the file. Room 2 is still pending - the
      reminder runs for that room only."
- [x] **The numbers card** lists one line per room, so a room with nothing
      on it is a gap you can see rather than a total to work out.
- [x] **One thing left** says why nothing is at risk - the guest is safe,
      one reminder, Hoteliana sees the same flag - and that a confirmed
      booking is not yours to cancel.
- [x] In Arabic the room's name comes from the offer line, which is where
      the Arabic name actually lives; it had been printing "Standard Room"
      inside an Arabic sentence.

### OV 05.2S / 05.10S, one number for the whole booking

"Same number for all rooms" had been a third radio beside "one per room"
and "not issued yet". The frame nests it as a tick **under** the first
option, and that is the better model: it is not a third way of answering,
it is a variation of having the numbers - the hotel issued one instead of
two. The form follows the frame.

- [x] The chosen block is tinted, the legend carries the frame's own
      three-part overline, and the intro says what Hoteliana needs and
      that confirming without a number is allowed.
- [x] **The field names the rooms it covers.** Two rooms reads "NUMBER FOR
      BOTH ROOMS", and under it "Hoteliana stores it against Room 1 and
      Room 2. Untick to type one per room." - so the tick's consequence is
      stated rather than inferred.
- [x] One message under the field, not two. An empty field had printed
      both "type the number for this room" and "type the number, or untick
      Same number for all rooms", which contradict each other.
- [x] Room numbers are written in the reader's digits: غرفة ١, not غرفة 1.

### UI 02.5 and OV 02.5C3 / D2 / E2, how a new room ends

A new room could end two ways here - waiting, or approved. The frames give
it four, and the two that were missing are the two that need something
from you.

- [x] **Linked** (OV 02.5C3). The room was already in the catalogue under
      another name, so nothing was added and the request now points at the
      room that exists. The card says what changed and what to do next:
      price it. A quiet outcome, not a refusal.
- [x] **Needs you** (OV 02.5D2). Hoteliana asked a question before
      deciding, and the note says the clock is paused while it is open -
      waiting on you is not the same as being late. The question is quoted,
      what is needed is listed, and the reply box is right there.
- [x] **Rejected** (OV 02.5E2). The frame does not stop at "no": it quotes
      the reason and names what to sell instead, because the supplier
      still has three guests to put somewhere.
- [x] **The timeline shows what happened, not which step it is.** An
      active step had been drawn as its own number; a refusal is a red
      cross now and an open question an amber mark.
- [x] **`Linked` counts as approved**, because the tile reads "linked or
      added" - otherwise a linked room would be in the list and in no tile.
- [ ] The frame's footer reads "Showing 2 of 2 requests" while the list
      above it holds five. Ours prints the real count. For the designer.

### UI 07.32 / 07.32R / 07.32E, payments

The page had been a balance card and a table of movement counts, built
from the older design. The frame leads with three tiles, because the three
questions a supplier opens this page with are how much this year, when was
the last one, and when is the next - and only the third is not already
known.

| | Frame | Was |
|---|---|---|
| Tiles | paid this year, last, next | a balance card |
| Covers | what the transfer was for, in two lines | a count of movements |
| Filters | Period, Hotel | none |
| Footer | "4 of 16 payments · to Al Rajhi Bank ···· 4417" | a note |

- [x] **UI 07.32R is the one that matters.** A transfer the bank sent back
      is still on the list, because it happened, and marked `Returned`,
      because it is not money you have. The banner names the payment, the
      amount, the date and the reason, and offers the one thing that fixes
      it - which is not "contact us", it is the bank account.
- [x] **UI 07.32E.** Nothing paid yet is not a failure: the tiles read 0
      and two dashes, and the empty card says when payments will appear
      rather than that there are none.
- [x] The rows are the frames' own - PAY-013 to PAY-017 - which replaced
      three rows from the older design that no frame draws.

### OV 05.16D / 05.17D, the two range pickers on bookings

The same picker, asked two different questions, and the frames answer
them differently.

- [x] **A stay range counts nights; a booked range does not.** Stay dates
      reads `Sun 20 - Sat 26 Sep · 7 nights · Bookings with any night in
      these dates`. Booked reads `Sun 20 - Sat 26 Sep · Bookings made on
      these days`, with no count - a booking made on Sunday and again on
      Tuesday did not last three nights, and saying so would be a small
      lie about the supplier's own data.
- [x] The action is `Show 20 - 26 Sep`, not `Use`: a filter shows, it
      does not edit.
- [ ] The frames draw a fourth shortcut, `Whole season`. Ours shows it
      only where a season is in scope, and the bookings list spans three
      hotels and every contract, so there is no one season to mean. For
      the designer.
- [x] Two Arabic slips on the list behind it, caught while driving the
      picker: `٢ غرف` for two rooms, and the response clock printing
      14:35 in western digits inside an Arabic sentence.

### UI 07.20N and OV 07.38, when you owe Hoteliana

Chain A17 in the guide: a booking paid on booking is cancelled after
payment, so the money goes back. The overview had the state but not the
numbers, and the way to pay it early did not exist.

- [x] **The banner names the booking.** `You owe Hoteliana 2,310 SAR`,
      then which booking it came from, that it comes off the next payment
      by itself, and the date after which a transfer is asked for
      (BR-07-60's sixty days, drawn as 30 Nov). A banner that says only
      "you owe" leaves the supplier to guess all three.
- [x] **The next payment is not zero.** Ours floored it at 0, which is
      BR-07-58's rule for the *other* case - deductions bigger than the
      payment. Here the debt is smaller, so the tile reads `16,140` and
      prints the sum under it: `18,450 – 2,310`.
- [x] **OV 07.38.** Bank, IBAN, amount, and the reference that makes the
      transfer matchable - `JEWAR-NEG-2026-09 - write it on the
      transfer`. The band under it is the point: doing nothing is a
      complete answer, and a page that hands you an IBAN reads like a
      bill unless it says so.
- [ ] The frame masks the IBAN and marks a Copy control as suggested.
      Ours shows the masked form without a Copy. For the designer.

### The other three overlays, read against their frames

Having found the Restrictions middle adrift, the same pass over OV
04.BSF, 04.BPF and 04.BRF. They were closer, but not level.

- [x] **The day pills are not on Restrictions.** OV 04.BXF has no week
      of pills at all - "Applies on" asks the same question as a
      sentence. The other three keep them, as their frames draw them.
- [x] **"All live" was a lie about drafts too.** OV 04.BPF prints
      `2 on this contract · 1 not published yet` beside a
      `Draft · not published` row. Ours said "all live". It counts
      drafts now, and English names the number alone as the frame does
      while Arabic takes the noun with it.
- [x] **Release names its cut-off.** The frame's headline is
      `Release 2 days before · 18:00 on 8 nights × 1 room`; ours said
      `Release 3 days` and then multiplied out the room-nights. A
      release is a day and an hour, not a quantity bought.
- [x] Stop sale and bulk rates keep their `= {total}` room-nights,
      because their frames do: a price and a closure are bought by the
      room-night in a way a stay rule and a cut-off are not.
- [x] Two Arabic slips in the release copy, caught in passing: the
      clock printed `18:00` in western digits inside an Arabic sentence,
      and `٣ يومًا` should be `٣ أيام`.

### OV 04.BXE / 04.BXF, the Restrictions middle

Reading the frames again once Figma was reachable: the Restrictions
overlay's middle was not the frame's. It had a pair of Open / Closed
toggles for the whole range where the frame has two other things.

- [x] **`Applies on`** - `Every day in the range` or `Weekend days only
      · Thu, Fri`, with the sentence that matters under it: on the
      nights it does not cover, a guest books as though the rule were not
      there. That is not the day-pill filter the other three overlays
      share, and it is not a filter at all.
- [x] **Check-in and check-out are per night.** The picked nights come
      back as the month they are in, each with its own `In` and `Out`
      chip, green open and red closed. A weekday name closes its whole
      column, because "no arrivals on Fridays" is one decision. The week
      starts on Saturday so the contract's weekend closes the row rather
      than straddling both edges, as the frame draws it.
- [x] The empty state is the frame's own sentence rather than a blank:
      `Pick nights first. They show here as a calendar...`
- [x] **What will happen**, in the frame's four lines: which nights lost
      an arrival or a departure by name, what applies after them
      (`the contract rule (minimum 2 nights)`), that it reaches new
      searches only, and that it is a draft until published. The headline
      is `Minimum 3 nights on 8 nights × 9 rooms` - not their product,
      because a stay rule is not bought by the room-night.
- [ ] **The frame's own panel contradicts the contract.** OV 04.BXE and
      BXF draw `2 on this contract · all live`, with `Every night ·
      Min 2 nights` and `20 - 25 Sep · All rooms · Fridays only ·
      Check-in closed`. The contract's Restrictions table has three
      rules, one Inactive, and says 20 - 25 Sep is four nights with no
      check-in on the 23rd - which OV 03.RSP1 confirms by name ("Wed 23
      Sep · check-in closed"). Ours follows the contract. For the
      designer.
- [ ] Tapping the day number itself: OV 03.RSP* draws a Day actions
      overlay in the older node, so the number may be meant to open that
      rather than toggle. Ours toggles the chips only. For the designer.

### The restrictions, in the three places they were written

The Restrictions overlay on the rate calendar disagreed with the
contract it belongs to, and so did the calendar's own Min nights row.
Three copies of one rule, three answers.

| | The contract says | The overlay said | The grid said |
|---|---|---|---|
| Rules | 3, one inactive | 2, "all live" | - |
| Sep minimum | 2 nights, 01 - 30 Sep | "Every night" | 2 nights |
| The exception | 4 nights, 20 - 25 Sep, no check-in 23rd | check-in closed, Fridays only | 4 nights 20 - **26**, no check-in **24th** |
| Feb 2027 | Deluxe City, 3 nights, inactive | missing | - |

- [x] **The panel reads the contract.** `alreadySet.restrictions` is
      derived from `contractRestrictions` rather than written a second
      time, so the three rules appear with the contract's own dates,
      scope, minimum, check rules and the overlap note that explains
      which rule wins on 20 - 25 Sep.
- [x] **"All live" was a claim, not a fact.** A rule dated for next
      February is Inactive in the contract's own table, so the count
      says `3 on this contract · 1 rule not active yet` and that row
      carries a `Not active yet` pill beside `From the contract`.
- [x] **The grid was a day out.** Its Min nights row ran the four-night
      rule to the 26th and closed check-in on the 24th. The contract
      says 20 - 25 and the 23rd, and the contract is what an agent is
      held to.
- [x] Checked the neighbours while the rule was open: the release
      overlay's contract row and its 24 - 30 Sep exception both agree
      with the grid's release line, and the per-night restriction
      overlay already quoted the contract correctly.

### The digits a sentence is written in

A sweep of the portal in Arabic, after the rate grid turned out to be
printing 400 and 30 under Arabic prose. It was not alone.

- [x] **`fill` formats the numbers it interpolates.** The template is
      already the reader's language - every caller passes the Arabic
      string when the portal is in Arabic - so an Arabic sentence now
      gets Arabic-Indic digits and its own thousands separator. Strings
      are untouched: a reference like HTL-88214 is a name, not a
      quantity. One change, 344 call sites.
- [x] The prices that went round `fill` rather than through it: the
      change-request ceiling, the contract's room prices, the win list's
      targets, the bookings list's totals, the account's figures.
- [x] The dashboard's money tiles carry an Arabic value, and its counts
      and the bookings list's chips, stay cells, room counts and pager
      read in the reader's digits.
- [x] The sweep itself, route by route in Arabic. Clean now: the
      dashboard, bookings, change requests, contracts, the rate
      calendar, the whole of finance, team, cases, the agreement and
      getting started. What it caught on the way: the contracts' four
      KPI tiles, the team's counts and chips, the change requests'
      chips, and the numbered steps on getting started.
- [ ] A version like `1.3` stays western inside Arabic prose, because it
      is a name rather than a quantity. Worth a designer's eye if that
      reads oddly to an Arabic reader.

### OV 04.6B / 04.6C / 04.6L / 04.6L2, the nights field

The Change prices overlay had a nights field with a calendar in it, and
the calendar's Apply threw the range away. Every screen the frames draw
for more than one night was therefore unreachable except by selecting
cells on the grid first.

- [x] **The field is a field.** What it picks goes back to the page,
      because everything else on the overlay - the split, the season,
      what the nights already carry - is read off the month rather than
      kept in the overlay. The page keeps it until the overlay closes.
- [x] **A run of one kind has nothing to split.** OV 04.6B and 04.6C
      drop the two cards and price one box: `All 3 are weekdays` with
      `Price per night · weekdays · SAR`, `Both are weekend nights`
      with `· weekend ·`. "1 weekday · 0 weekend nights" is an
      arithmetic answer to a question nobody asked.
- [x] **The hint names the weekday**, as the frames do: `1 weekday (Sat
      26) · 2 weekend nights (Thu 24, Fri 25)`, not a bare count.
- [x] **The range names the day too** - `Thu 24 - Sat 26 Sep 2026`,
      because `24 - 26` is a range and `Thu 24 - Sat 26` is a weekend.
- [x] OV 04.6L and 04.6L2, the fixed-price twins, were already built and
      only unreachable: a fixed contract now opens on `Weekdays · 1
      night · SAR` / `Contract 490` over three picked nights.
- [x] The grid printed its prices in western digits under Arabic while
      every number around it was Arabic. Every figure it prints - the
      day, the price, the meal total, the inventory, the min nights, the
      release - now reads in the reader's own digits, and a four-figure
      price carries its separator the way the frames print it:
      `1,000` and `١٬٠٠٠`.

### OV 03.14P / 15P / 16P / 17P, picking a season's dates

The dates field in the season editor was a read-only box. It opens a
picker now - two months at most, the season's own - and the rule that
matters is not enforced after the fact: the nights another season owns
are locked, drawn in its colour, and the legend names the season that
owns them. A rule you cannot break beats a rule you are told about
afterwards.

- [x] **The description has two answers, not one and a blank.** A season
      with neighbours says its nights are locked; Hajj and Summer say
      "No other season falls in these months, so every night is free" -
      the same sentence answered the other way.
- [x] **The lock is computed, not seeded.** Ramadan's March shows Last
      ten nights locked 10-19 and Last ten's March shows Ramadan locked
      1-9, both read off the other seasons' own months. And a range may
      not jump a locked night: picking 20 Feb then 20 Mar does nothing,
      because the season would swallow a season.
- [x] Every frame's footer reproduced from the data: `18 Feb - 09 Mar
      2027 · 20 nights`, `10 Mar - 19 Mar 2027 · 10 nights`, `10 May -
      20 May 2027 · 11 nights`, `01 Jul - 31 Aug 2027 · 62 nights`.
- [x] Applying keeps the range on the editor's dates field, so the
      picker is a field rather than a demonstration.
- [ ] The frames show only the months a season already touches, so a
      season cannot be moved into a month it does not reach. Moving one
      is a different job and no frame draws it. For the designer.

### UI 05.4B, confirmed with an issue open

The same reference-pending booking as UI 05.4, with a third badge:
`Issue open · ISS-2026-0184 ›`. The badge already existed - what the
screen needed was a booking that is waiting for its numbers *and* under
review, which is a state no row in the data had.

- [x] **The numbers card draws at zero.** It had only appeared once a
      number was in, so the screen that is entirely about missing numbers
      showed none of them. `0 of 2 rooms have a number`, with both rooms
      named and pending, is the frame's own answer.
- [x] **One number per room changes the words, not just the count.** "the
      number" is wrong on a booking that needs two, so the result line,
      the button, the title, the body and the three outcome cards all have
      a plural the page picks by room count.
- [ ] The frame numbers it HTL-88214 again. Ours is HTL-88223, for the
      reason given under UI 05.11G. For the designer.
- [x] Arabic, in the same cards: `٠ من ٢ غرف` became `٠ من غرفتين`,
      and the clock stopped printing 12:14 in western digits inside an
      Arabic sentence.
- [x] **Arabic's dual has two cases**, and `counted` only knew one:
      `غرفتان` standing alone, `من غرفتين` after a preposition.
      `countedOf` is the governed form, and every counted word now carries
      it - the phrase after من was wrong everywhere until it did.

### UI 05.11G, the booking sold at a nationality price

The end of the nationality thread: the contract sets the group price, the
calendar shows it, and here a booking carries it for ever. 700 / 700 / 600
is Ramadan's 740 / 740 / 640 less the group's 40 a night, and the page
prints both so the number can be checked rather than trusted.

- [x] **A booking keeps what it was sold at.** The band's body was already
      right - the rate and the policy never change after the sale - so
      only its title moved: it names the group instead of the old rate.
- [x] **The guest line carries the reason.** `Saudi · GCC nationals price
      used` sits on Nationality, because that is the fact that produced
      the rate, and a rate with no reason beside it looks like a mistake.
- [ ] The frame numbers this booking HTL-88214, which in our data is the
      same booking *before* it was answered: on request, September, 4,620,
      and the stay PAY-015 paid for. One reference cannot be two stays, so
      the Ramadan booking is HTL-88220. For the designer.
- [x] **A duplicate id, fixed.** UI 05.11C's booking had been given
      HTL-88176, which is Bader Al-Harbi's across change requests, the
      September statement and the team log. It is HTL-88179 now, with its
      own confirmation numbers, and the frames' 44182 / 44183 belong to
      the booking that actually shows them.
- [x] **Two numbers do not belong in a headline.** A booking with a number
      per room now says `both rooms have their number`, as the frame does,
      and keeps printing the number only when there is one to print.
- [x] Three Arabic slips in the same cards, fixed while they were open:
      `٢ غرف` for two rooms, western digits inside Arabic sentences
      (٨٣٠, not 830), and an English `{n}` that was never filled because
      the page had been passing `rooms`.
- [ ] The frame moves `· incl. VAT` from the rate row to the total row.
      BR-00-02 wants it on every price label, so both rows keep it.

### OV 04.1PN / 04.1PN0 and UI 04.1TGCC / TIM / TPK, prices for

The other half of the nationality prices. The contract sets them inside a
season (OV 03.12N); this is the calendar showing what one group actually
pays, night by night, so the answer can be read rather than worked out.

- [x] **BR-03-91 is the banner.** Every one of the three bands says the
      same thing twice: the group's price applies in Ramadan and Last ten
      nights (1 - 19 Mar), and from 20 Mar there is no season, so everyone
      pays the contract price. The last twelve columns of all three frames
      are identical, and ours are too.
- [x] **Two ways of differing, drawn exactly.** GCC nationals is the
      season price less 40 and Indonesia & Malaysia is 60 more - an
      adjustment, so it follows the season. Pakistan is a fixed price per
      room, so its nine rooms are written out per season rather than
      derived: a price stops being fixed the moment it is computed.
- [x] **Every number checked against the frame.** All nine rate rows of
      UI 04.1TPK were read cell by cell, and the grid now prints them:
      690 / 790 and 1,050 / 1,150 for Standard City, 880 / 980 and
      1,240 / 1,340 for Quad, and so on through Junior Suite.
- [x] **OV 04.1PN0** is not a disabled menu. When no night on screen sits
      in a season that priced by nationality, each group says where its
      prices do live instead of offering a view that would change nothing.
- [ ] The field's value for the first option. The menu calls it
      "Everyone · season price"; the field has 190px, so it reads
      "Everyone". The frames only ever draw a chosen group. For the
      designer.
- [ ] The frames show all nine rooms priced on the Makkah Annual Block,
      while our Ramadan Block still carries UI 04.1U's three unpriced
      rooms. Both are true of their own contract; the prices-for view is
      the same on either.

### OV 07.11, the remittance advice

There is no frame for it. Flow 12 draws UI 07.32 / 07.32R / 07.32E and
stops, and the older node's UI 07.5 and UI 07.6 are the two screens
BR-07-05 removes for good. So the advice is built from the guide, which
names it exactly: step 11 opens OV 07.11 with Payment, Paid on, Bank
reference, Paid to, Lines, Total and Held back, a format, and a download.

- [x] **UI 07.6 is gone, and its links are not.** A page per payment was
      the old design; a payment's own page is now its advice. So
      `/finance/payments/PAY-016` is no longer a route - it lands on
      UI 07.32 with that payment's advice open, which is the same
      redirect rule BR-07-05 already applies to the running account.
- [x] **BR-07-54.** Amount, then what it was, then the booking or entry -
      in the statement's order, with the summary under the lines. Each
      advice adds up to its statement: August is 21,120 + 640 - 460 =
      21,300, July is 14,980 flat, September is 20,130 + 1,420.
- [x] **BR-07-53 / BR-07-16.** The disputed relocation is not a deduction
      on the advice, it is held back: the lines come to 21,550, 3,100 is
      held while DSP-2026-0008 is open, and 18,450 is transferred - which
      is the number the frame prints for PAY-017.
- [x] **BR-07-55.** A returned transfer keeps its advice, marked
      `Returned · 17 Oct 2026`, and still downloads. The archive needs
      the transfer that failed as much as the one that worked.
- [x] **BR-07-51 — the re-payment.** After the account is put right the
      same money goes again, so Payments carries two rows: PAY-017
      `Returned` and PAY-018 `Re-payment of PAY-017` `Paid`. No frame
      draws this - 07.32R is the moment the money came back, not the
      moment it was sent again - so it is `?state=repaid`.
- [ ] The new account's last four digits are ours. Nothing names the
      account the re-payment went to, and it cannot be the closed one, so
      PAY-018 pays `···· 5183` and the footer names it from then on.
      For the designer.
- [ ] Q6 in the guide: the relocation is 3,100 as INC-0087 on the
      September statement and 3,540 as ADJ-2026-0041 on 07.23 / 07.33.
      The advice follows the statement it belongs to, so it holds back
      3,100. For the designer.

### UI 07.35 and 07.35.1-8, the reports

Eight reports where there had been four, and each has its own screen now
rather than a format picker and a download. The shell is identical across
all eight, and that sameness is the design's argument: the shape is
learned once - back, title, four filters, the tiles, the table - and every
report after the first is read without relearning it.

| | Frame | Was |
|---|---|---|
| The shelf | eight cards, two columns, `Open` each | four rows with a period and a format |
| A report | its own page | a download from the list |
| Filters | From, To, **Date based on**, Hotel | Period, Format |
| Tiles | two or three, tinted at the ends | none |
| Export | Excel and PDF, off when empty | one Download |

- [x] **The third filter is the one that matters.** "Date based on" asks a
      different question per report - a payment date, a check-out, a due
      date - and it is how two reports that should agree stop agreeing.
      It is written per report rather than shared.
- [x] **UI 07.35E.** Empty dates are an answer, not a failure: the opening
      and closing balances read a dash because there is no balance to
      state, the movements read 0 because there genuinely were none, and
      export goes off until there is something to export. Which tile does
      which is written per tile, because the frame decides it per tile.
- [ ] The rows are the frames' own figures, written rather than computed.
      A report reads what finance holds; when that is real, these become a
      query, and a figure that disagreed with the page behind it would be
      a bug rather than a rounding.

### OV 04.6A-F and P1-P2, the first pass on Change prices

The per-cell overlay was `Change one night`, built from the older OV 04.5*
frames. Flow 12 renames it `Change prices` and gives it the same name
whether it is holding one night or seven - the count is already in the
field below it and again on the button, so the title does not need to
carry it too.

| | Frame | Was |
|---|---|---|
| Nights | a full-width field that opens the picker | a read-only date box |
| Under it | 5 weekdays · 2 weekend nights (Thu 1, Fri 2) | nothing |
| The split | two cards: one price, or the contract's two | two boxes, always apart |
| Days | `Apply to these days`, seven pills | absent |
| Prices | two columns, `Contract 400` under each | inline boxes |
| Season | a band saying these nights are in none | absent |
| Save | `Save 1 night` / `Save 7 nights` | `Save change` |

- [x] **The nights field is the question every other field answers**, so it
      goes first and full width, and it opens the Flow 12 picker.
- [x] **`Apply to these days`** is how OV 04.6F - October, Fridays only -
      is the same screen rather than another overlay.
- [x] **BR-03-91 said out loud.** Outside a season every nationality pays
      the one price, and the band says so before anyone wonders where the
      nationality prices went.
- [x] **OV 04.6N / 04.6H / 04.6I / 04.6J.** Inside a season the grey band
      is replaced by what each nationality group will pay - read off your
      own price for a group that follows it, and a box for the group with
      its own. Above it, three bands say what the picked nights already
      carry: a price of their own, a closure, or bookings that keep the
      price they were made at. Under your own floor is a warning and still
      saves; a price of 0 is a refusal.
- [x] **Two bugs the frames uncovered.** A custom date window's columns are
      not days of the month, and treating them as one printed "Fri 1 5 - -"
      as a date; the date is asked for now. And in Arabic the price box
      held ٧٤٠, which the zero check stripped to nothing and then refused
      to save - it reads Arabic-Indic digits now.
- [x] **OV 04.6G / 04.6O.** A run of nights can cross a season boundary,
      and the blue band names both sides before one price replaces them -
      "Ramadan 7 - 9 (3 nights) and Last ten nights 10 - 13 (4 nights)".
      Each night keeps its own season's nationality rules, which the card
      below says rather than leaving to be guessed.
- [x] **OV 04.6K / L / L2 / M.** A fixed-price contract has no supplements
      to carry, so the card goes and the field asks for the full price of
      the room and its meal plan. It splits weekdays and weekend like any
      other - the guard that stopped it doing so was ours, not the frame's.
- [x] **The nights field prints the nights it holds.** The range and the
      weekend list had been written into the copy - "27 Sep - 3 Oct 2026",
      "(Thu 1, Fri 2)" - which was right for one frame and wrong for every
      other pick. They are read off the picked nights now.

### OV 04.B*, the 37 frames of the bulk overlays

Four overlays - Bulk rates, Stop sale / On Request, Release, Restrictions -
sharing one shell and one lifecycle: empty, picking nights, nights picked,
filled, added to the list, review, saved, change removed. The frames draw
all four through every step, which is what makes them one component and not
four.

- [x] **Bulk rates joined the other three.** The frames give it the same
      nights row, the same rooms grid, the same list and the same side
      panel; only its middle and what happens at Review differ. It had been
      a separate, older overlay built from OV 04.1*.
- [x] **The review step is where the four part company.** Stop sale applies
      the moment you confirm - green band, `Confirm & apply now` - because
      you cannot sell a night you have already closed. Prices, release and
      stay rules are drafts: grey band, `Save all as draft`, and nothing
      reaches agents until Review & publish. The frames say so in four
      separate screens; the code says it in one table.
- [x] **The night picker** is the Flow 12 Row I component, opened over the
      side panel as the frames draw it - month, four shortcuts, the summary
      and the legend. Each range added becomes its own chip.
- [x] **What will happen has four tempers**: grey while it has nothing to
      say, green when the change is sound, amber when it is sound but has a
      consequence (OV 04.BRRW), and a red line when a field must be fixed
      first (OV 04.BRRE, OV 04.BPPE).
- [x] **OV 04.BSAC** names every contract on the hotel one by one, with the
      rooms each carries - and says out loud which room a contract does not
      have, rather than quietly dropping it.
- [x] **Arabic counts four ways**, and it was saying "٤ ليلة" where the
      language wants "٤ ليالٍ". Counts are now phrases chosen in
      `src/lib/arabic-count.ts` - one, two, a few (3-10), many (11+) -
      rather than a number with a noun bolted on. The nationality tab, which
      had its own copy of the rule, now reads from the same place.
- [ ] `BulkRatesOverlay` in `rate-overlays.tsx` is the old OV 04.1* design
      and no longer has a caller. About 500 lines to remove once nothing
      else in Flow 04 wants it.
- [ ] The frame's BRRW bullet says the rooms go back "2 days before each
      night" while 14 is the number typed above it. Ours prints the number
      that was typed. For the designer.

### OV 03.12N / N0 / NA / NE / NX, corrected against the frames

The tab was listing **which countries** are in each group. The frame lists
**what each group pays**, room by room, with the season's own prices in a
grey row underneath - so you can see at a glance whether a group is worth
having. That is a different table, not a different style, and the countries
moved to a line under the group's name where they cost nothing.

| | Frame | Was |
|---|---|---|
| Where | inside the **season editor**, OV 03.12's modal | in the season detail panel |
| Table | group, how it differs, then a column per room | group, countries, how it differs |
| Last row | All other nationalities, **with the season prices** | the row, but no prices |
| How it differs | two lines: the amount, then what it is on | one line |
| Edit | a text link in the row | an outlined button |
| Add / Edit | a centred modal of three numbered cards | a 720px drawer of three sections |
| The change | typed **in each room's row** | one field above the table |
| NX | a pink banner over the whole form, save disabled | a red line under one field |

- [x] **The data is the frame's.** Three groups - GCC nationals, Indonesia
      & Malaysia, Pakistan - over three rooms, and every number in the
      table is the frame's: 600/700, 720/820, 700/800 and the rest.
- [x] **NA picks neither way.** Step 2 says "Pick one way for this group",
      so the form does not pick for you; the table still lays itself out as
      an adjustment, because that is what typing in it would make.
- [x] **One adjustment, three inputs.** The frame puts a change field in
      every room's row, and BR-03-92 gives a group a single adjustment.
      Both are true at once: the field is shown where its effect is read,
      and typing in any row sets the one adjustment.
- [x] **Arabic counts four ways.** "٢ دول" was wrong where "دولتان" is
      right - one, two, a few (3-10) and many (11+) each take their own
      form, so counts are chosen now rather than interpolated.
- [x] The season **detail** panel gave the tab up. Two overlays each
      holding their own copy of the same groups would have drifted, and no
      frame draws the tab there.

## The toolbar, the menu, and a sweep

- [x] **The desktop menu closed itself.** Hover opened it, then the click
      toggled it shut - so clicking Finance on a desktop looked like the
      button did nothing. A click now opens; Escape, a click outside,
      choosing an item or moving away all close. Touch still toggles,
      because there is no hover to have opened it.
- [x] **And the panel was being clipped away.** The nav rail scrolls
      horizontally, so it carries `overflow: auto`, and an absolutely
      positioned child of a scroll container is clipped to it. The rail is
      42px tall and the panel is 610 - so it opened, sat in the DOM, and was
      painted out of existence. It is `fixed` now, placed from the button's
      measured rect and re-placed on scroll and resize, so no ancestor can
      clip it. This is why the first fix looked like it had not worked.
- [x] **The filter chips** are pills in semantic tones, as the frame draws
      them: red for what cannot sell, amber for what needs looking at, and
      All in green because it is the absence of a filter - the only one with
      no dot and no count. The count is the same type dimmed to 70%, not a
      second font, and the group has no fill and sits at the end of the row.
- [x] **Selection is not drawn in Figma** - the frame only ever shows the
      chips at rest. The chosen chip now fills dark (`#101713`, white text)
      and keeps its coloured dot, so the one filter that is doing something
      reads as a single dark object in a row of quiet ones, and carries an
      ✕ to turn it off. All, being the absence of a filter, drops its pill
      when it is not chosen: plain text, because there is nothing to un-set.
      This follows the states the user sent rather than the frame, which
      does not draw them.
- [x] **The toolbar holds one row where it can.** The frame puts the four
      bulk buttons, the chips, the colour key and Export on one 44px row,
      and at 1440 that is what it does. Below 1280 the row cannot hold, and
      letting it wrap where it likes drops the colour key under the chips on
      its own, reading as a mistake - so it breaks deliberately: the actions
      keep one line with Export, the chips and the key keep the next. The
      frame draws six chips; the guide fixes the row at seven, so seven is
      what the row must carry.
- [x] **The back link.** The frame draws none: Rates & Availability is a
      place of its own. It only appears when you arrived from a contract -
      `?contract=` - so the way back is the way you came.
- [x] **OV 04.BS* / 04.BR* / 04.BX*** - Stop sale / On Request, Release and
      Restrictions are one shell with three middles, which is how the frames
      draw them. Restrictions had no handler at all and opened nothing.
- [x] The bulk overlays' later states: picking nights, nights picked, added
      to the list, review before saving, saved as draft, change removed -
      and OV 04.BSAC (every contract on this hotel) and 04.BRRW (release
      already passes some nights). All built since, in
      `bulk-range-overlay.tsx`.

Swept 32 routes at 1440, 768 and 393, and the main thirteen in Arabic RTL at
393: no horizontal overflow anywhere, every page rendering.

## UI 04.1 · the panel above the calendar, redrawn

The three questions used to be three overline headings over loose
checkboxes. They are now three sections, each with its icon in a mist
circle, its question, and the sentence that says what answering it does -
which is the frame the designer sent.

- [x] The checkbox is drawn rather than left to `accent-color`: the frame
      gives it a 5px radius and a filled `#0b3d2e` that no browser default
      matches. The real input stays, invisible, so the keyboard and screen
      readers still get a checkbox.
- [x] Each switch is a bordered pill, so the whole pill is the target and
      the labels line up in columns instead of ragging.
- [x] `--surface-brand-mist` is new: the tint behind a brand icon badge.
      `--primary-subtle` is the lime and reads as a highlight; this one is
      the quiet green the frame draws.
- [ ] **The rooms sit two across, not three.** The frame draws three, and
      three would need about 60px more than the page has: the longest name,
      "Deluxe Room · Partial Haram View", needs a 244px pill, three of those
      plus the other two questions come to roughly 1500px of content, and
      `main` is capped at 1440. Rather than pick a breakpoint and cut the
      name in half at three different widths, the track floor is 244px and
      the column fits as many as it can hold - three if the cap is ever
      raised, two at 1440, one when the panel becomes a stack. A room name
      you cannot read is worse than a panel one row taller.
- [x] The column floors are measured, not guessed: 204px is exactly
      "Pickup · last 7 days", and the rows question gets 32fr so its first
      line breaks after "Stop sale / On Request", where the frame breaks it.

Checked at 1920, 1600, 1440, 1280, 1040, 768 and 393, and in Arabic RTL:
no horizontal overflow, and no label cut at any of them.

## The Property tabs, and the toolbar as a card

- [x] **The tabs stopped moving.** The active tab was a measured pill that
      slid between tabs - a ResizeObserver, a `document.fonts.ready`
      callback, a rAF and a 300ms transition, all to move a rectangle the
      eye had already found. The active tab is simply filled now, and 40
      lines of measuring went with it.
- [x] **And they stopped moving between pages.** Each route pasted
      `<PropertyTabs />` in by hand, which put them above the title on six
      pages and below it on the seventh - the section's own navigation
      changed place as you walked through the section. `PageHeader` renders
      them now, under the title and its sentence, and the list of pages
      that carry the bar lives in one file. A route cannot get it wrong
      because a route no longer decides.
- [x] **The toolbar is one card**, two rows with a rule between them: what
      acts on the calendar above, what narrows it below. At the end of each
      row, past a divider, sits the control that changes nothing - Export
      above, the colour key below. Before this it was two bare rows on the
      canvas, so the filters floated between the panel above and the grid
      below and belonged to neither.
- [x] Each action carries its icon, and the buttons are pills, as the frame
      draws them. The counts moved into their own badge - `bg-current/15`,
      a deeper wash of whatever the chip is already printing, so one rule
      covers the tint and the dark fill both.
- [x] All shows its dot only while it is the filter in force. Off, it is
      the plain way back rather than a state of its own - which is how the
      two frames draw it between them.
- [x] The counts read in Arabic-Indic digits in Arabic. The label already
      did - "٤ أو أقل" beside a Latin "1" was the chip disagreeing
      with itself.

## The calendar on a phone

- [x] **The ring on today was drawn by arithmetic that only held on a
      desktop.** `calc((100% - 218px) / nights)` is the column's width
      while the whole month fits, and on a phone it never does: at 393 the
      ring came out 5px wide, over the wrong night. It is measured off the
      cell now.
- [x] **And it was measured in the wrong direction.** An absolute child of
      a scroll box takes `left` from the left of the visible area and
      `right` from the right of it - and each of those is the edge the
      content starts at, because the overflow runs the other way. Measured
      in `left` for both, the ring landed 900px from today in Arabic. It is
      placed with `inset-inline-start` from the table's own starting edge,
      which is the one measurement that means the same thing in both.
- [x] **The row-name column was 218px at every width** - three fifths of a
      393px screen, leaving room for one night. It is 150 on a phone, 186
      on a tablet and the frame's 218 from `lg` up, through one variable on
      the scroll box so every sticky cell reads the same number.
- [x] **"Worth doing now" was 499px tall on a phone, one letter per line.**
      `flex-1` on the sentence in a wrapping row lets it shrink to its
      narrowest word rather than claim a line, and with two buttons beside
      it there was always room to shrink. The banner is a column on a
      phone - sentence, then the two actions sharing the line below - and
      the frame's single row from `lg` up. 191px now.
- [x] The same collapse was waiting in three more rows: the draft banner,
      the unpriced banner and the selection bar. They carry a basis now, so
      they wrap rather than shrink, and the selection bar's three actions
      stay together instead of each taking a row.
- [x] Export and the colour key no longer take a line of their own on a
      phone - `ms-auto` pushes them only where there is a row to push
      along.

1440, 768 and 393, English and Arabic: the ring sits on today at every
width and at every scroll position, and nothing overflows.

## Getting started on a phone

- [x] UI 01.5 draws a step as one row - the number, what it is, who owns
      it, where it stands, the chevron. That is a desktop row: the three
      things at the end are all `shrink-0`, so the only thing left to
      squeeze was the text, and at 393 it went to **71px wide and 243px
      tall**. A 268px step, eight of them.
- [x] It wraps now. The text keeps a 12rem floor so it claims the first
      line, and the owner, the badge and the chevron travel as one group
      onto the second, aligned to the end - rather than three loose pieces
      each finding their own place. 133px a step, and the desktop row is
      untouched at 66px.
- [x] The same floor is what keeps `lg` honest: there the card shares the
      row with the next-action panel and drops to 456px, and without it
      the text was the thing that gave way.

393, 768, 1024, 1280 and 1440, English and Arabic: one line a step from
1280 up, a wrapped pair below that, and no overflow at any of them.

## UI 09.0 · the occupancy heatmap, rebuilt from the frame

| | Frame | Was |
|---|---|---|
| Cell | 38px, 6px radius | 28px, 2px radius |
| Scale | seven greens, `#f2faf6` → `#158a60` | four, including a lime and a pink |
| Blocked | white, `#f0c4bf` outline, off the ramp | a pink **fill**, read as the bottom step |
| Axis | the night under each column, and the range | neither |
| Legend | empty → full, and what cannot be sold | none |
| Footnote | a sentence naming the white cells | none |
| Values | the frame's own marks | `(row*3+col*2)%10+1` |

The blocked cell is the point the description is making - "that is not
demand, that is a blocker" - and drawing it as a pink fill put it on the
same ramp as the greens, which said the opposite.

- [x] The ramp is `--heat-1` to `--heat-7` plus `--heat-blocked`, so the
      scale under the plot and the cells above it cannot drift apart.
- [ ] **The frame's legend says "cannot be sold · 3 nights" while its own
      grid draws four white cells and its own footnote says "The four
      white cells".** Two of the three say four. The count is read off the
      grid now, so it cannot disagree with what is drawn. For the designer.
- [ ] "Darker is fuller" is a light-mode sentence. On a dark card the ramp
      runs the other way - step 1 nearly the card, step 7 the brightest -
      because a near-white cell there would read as the fullest. The
      sentence needs a second half, or the card needs a different one.
- [x] The room names read in Arabic, and the nights in Arabic-Indic
      digits, with the range arrow turned round. The title said
      "الـ16 ليلة" with a Latin numeral beside Arabic ones; it does not now.

1440, 768 and 393, English and Arabic: 56 cells, four of them blocked,
nothing overflowing, and the nights scroll rather than shrink on a phone.

## OV 04.6M · a price box left empty

The frame draws an empty box with a red border, `Enter a price above 0`
under it and `Save 1 night` greyed out - and no alarm. OV 04.6J, the same
state on a base-price contract, draws the alarm with a typed `0` in the
box. Both were one condition in the code, which meant an empty box shouted
at someone who had not finished typing.

- [x] **A blank and a nought are different sentences.** Typing 0 is saying
      the night is free, which earns the alarm and the offer to close the
      night with Stop sale instead. An empty box is an unfinished thought:
      the border goes red, the line under it says what is wanted, Save
      stays off, and nothing shouts.
- [x] **The nights field counts.** It read `{range} · {count} nights`,
      which printed "1 nights" the moment a single night was picked, and
      in Arabic printed a Latin numeral beside Arabic ones. It is a
      counted phrase now - `1 night`, `ليلة واحدة`, `ليلتان` - and the
      single-night case prints the date the same way the frame does.

1440 and 393, both languages, on the fixed-price contract SC-2026-0155:
blank refuses quietly, `0` refuses and offers Stop sale.

## OV 10.9B · the version you sent, kept whole

The last Flow 12 frame. UI 10.9 gives a rejected version one line - what
was wrong with it - and nothing that answers the question a supplier asks
first, which is what they actually wrote. The frame answers it: the page
at the size it was received, `Download` beside the title, and the written
reason in red beneath the page.

- [x] **Three ways in, one panel.** `See why` on a rejected request and
      `View` on one under review both open the newest version there is,
      and every version row in the list opens its own - otherwise v1 is a
      line of text nobody can read.
- [x] **The reason sits under the page, never in place of it.** A version
      that was not rejected simply has no red line, which is how the same
      panel serves the contact detail that is still under review.
- [x] **v1 reads the same in both languages.** It was rejected for being
      typed in Arabic only, so showing an English translation of it would
      hide the whole reason it came back.
- [x] **Nothing here can be edited.** A sent version is a record and the
      correction is a new version - the page says as much two cards below
      - so the panel offers reading it and keeping a copy, and no more.
- [x] **The header counts what its own pill counts.** It said "three need
      you" beside a pill reading `2 needed from you · 1 in review`. The
      frame says two.
- [ ] **The description slot is carrying a control.** Figma draws
      `Download` in Body/S secondary, the same style as a sentence, in the
      modal's description slot. It is underlined here so it reads as
      something you can press. For the designer: either it is a link and
      should look like one, or it belongs in the Actions slot the frame
      leaves empty.

1440 and 393, English and Arabic: the panel is 760 wide with a 712 × 700
page, `ما أرسلته · النسخة ٢` in Arabic-Indic, RTL, nothing overflowing.

## The Arabic digits, swept once more

The app writes Arabic-Indic digits in Arabic, and had been doing it by
hand - so the misses were where a figure is not the point of the
sentence. Clock times were western everywhere ("١٤ سبتمبر · 16:10"),
and so were a run of counts, a few years and a handful of riyal figures.
A hundred and nineteen strings across fourteen files, found by walking
the source for string literals rather than matching them, so a quote in a
comment or a template could not shift the pairing.

- [x] **Times, dates, years and money.** `١٦:١٠`, `٨ سبتمبر`,
      `أكتوبر ٢٠٢٥ – سبتمبر ٢٠٢٦`, `١٬٢٤٠ ر.س` - with the Arabic
      thousands mark, not the Latin comma.
- [x] **Counts read in Arabic too.** `آخر ٣٠ يومًا`, `٤ وصول · ٣ مغادرة`,
      `عرض ١-٢٠ من ١٬٢٨٤ قيد`, `٦٤٪` with the Arabic percent sign.
- [x] **An identifier is copied, not read.** A masked account
      (`···· 4417`), an ID, the code you type into a field, a contract or
      agreement version (`الإصدار 1.3`, `v1.3`) and a clause number keep
      western digits, because they are matched against something printed
      elsewhere - a bank statement, an email, a signed PDF.
- [x] **The activity log counted in English.** Its figures went through
      `toLocaleString()` with no locale, so `1,284` stayed Latin inside
      an Arabic sentence however the copy was written. It takes the
      page's own language now.

Checked on the dashboard, the team pages, the activity log and the
system states, in both languages: no western clock time or count is left
in Arabic copy, and every reference is untouched.

## UI 02.2L · the gallery the counter was promising

The frame draws one photograph with `1 / 12 images` written on it and no
control of any kind - no arrows, no thumbnails, no way to reach the
second picture. The counter was hard-coded to `1 /` in the dictionary as
well, so even the number could not move.

- [x] **The arrows are on the picture.** The box is a fixed 232 in the
      frame and the profile card is levelled with it, so anything placed
      underneath would push the row out of the frame's own grid. They
      round-trip, so a gallery never dead-ends on its last photograph.
- [x] **The arrow points the way the language runs.** In Arabic the one
      on the right goes back, and the left arrow key moves forward -
      because that is the direction the pictures themselves travel.
- [x] **Both halves of the counter carry the same digits.** `{at} / {images}`
      has no letter in it for `fill` to read a language off, so the
      position is written by the gallery: `٣ / ٤ صور`, never `3 / ٤`.
      The total is a counted phrase, so four reads `صور` and one reads
      `صورة واحدة`.
- [x] **The quick view shows the same library.** OV 02.2 drew an empty
      green box; it is the hotel's own photographs now, with the arrows
      and - as the frame has it - no counter.
- [ ] **The frame says twelve images; we hold four.** `imageCount` was a
      number written beside the picture rather than the list behind it,
      which is how it could promise eleven nobody could reach. The list
      is counted now, so the badge reads `1 / 4 images` until the library
      supplies the rest. For the designer and the back end: the count
      follows the photographs, whatever their number.

1440, 768 and 393, both languages: the arrows reach every photograph, the
counter follows the one on screen, and nothing overflows.

## One way out of an overlay, and one way in

Asked for by the supplier: every modal closes on Esc and on a click
beside it, and opens without snapping into place.

- [x] **The click outside was not reaching anything.** A centred panel
      needs a wrapper to centre it, that wrapper fills the scrim, and the
      scrim tested `target === currentTarget` - so every click in the
      empty space landed on the wrapper and was read as "inside". It has
      been broken on every Modal and IconModal since the wrapper was
      added. The panel stops the event now, which stays true however
      deeply it is nested.
- [x] **Six overlays never listened for Esc at all** - the restrictions
      day dialog, the season date picker, the four bulk overlays' shell,
      the agreement's contract sheet, the room drawer and the room-sent
      panel. They share `useDismiss` with the rest now.
- [x] **BR-00-07 is overruled.** The drawer closed with ✕ and nothing
      else, by rule. A drawer that traps you where a modal lets you out
      is a difference nobody can learn, and the supplier asked for the
      one behaviour. For the guide: BR-00-07 no longer holds.
- [x] **BR-00-08 stands.** A panel holding typed work still answers the
      scrim and Esc with "Discard changes?" rather than closing under
      you - which is a way out, only one that asks first. It was
      unreachable before, because the click never arrived.
- [x] **Esc answers the overlay on top, and only that one.** A guard over
      a form is two overlays listening at once; with a listener each, the
      order they mounted in decided what closed. They queue now.
- [x] **How they arrive.** The scrim fades, a modal rises 8px and scales
      from 95% over 200ms, and a drawer slides in from the edge it is
      anchored to - the left one in Arabic - over 300ms. All of it behind
      `motion-safe`, so a reader who asked for less movement gets none
      and the panel is simply there.

Closing is not animated: an exit needs the panel to outlive the state
that renders it, which is a change in every caller rather than in the
primitive. The Radix dialogs already animate both ways.

## Flow 02 · Row 1 — asking for a hotel, checked frame by frame

Five frames: the selection bar (988:909), the quick view of a hotel
already asked for (OV 02.2D), the confirm panel for one hotel and for
two (OV 02.3), and the sent panel (OV 02.4). Every word was already
right; what was wrong was the shape and the counting.

- [x] **"1 hotels selected".** The bar printed a bare number with a noun
      after it. It is a counted phrase now, and in Arabic the adjective
      agrees with it: `فندق واحد مختار`, `فندقان مختاران`, `٣ فنادق مختارة`.
      `Clear selection` sits beside the count as the frame draws it -
      undoing a selection belongs where the selection is named, not
      beside the button that sends it.
- [x] **The confirm panel, as the frame draws it.** Each hotel is a
      filled row with its own photograph; the three things you are
      agreeing to sit in a tinted panel; and "the request is recorded
      under your name" is a footnote with an ⓘ beside it, because it is
      not something you agree to - it is something we do.
- [x] **The sent panel.** The references get a `#` tile, the three steps
      a tinted panel of their own, and the first step a tick rather than
      a `1`: it already happened, and numbering it puts it in the queue
      with the two that have not.
- [x] **Arabic counts in the case the sentence puts them in.** `إلى` and
      the construct in `تأكيد …` both govern the dual, so it reads
      `طلب الوصول إلى فندقين؟` and `تأكيد طلبين` - not `فندقان`, `طلبان`.
- [x] **Three English words inside Arabic sentences.** The city in the
      confirm rows, the district and city in the quick view's meta line,
      and the Latin comma between them on the card: all in the language
      of the sentence around them now.
- [x] **The quick view described the wrong hotel.** Its profile rows came
      from the copy file, so opening Al Safa City showed Al Noor Makkah's
      name, address and distance. They read the record now.
- [ ] **OV 02.2D's own data disagrees with itself.** Its header says
      "Al Noor Plaza Jeddah · Jeddah" while its body is Al Noor Makkah's
      (Arabic name, Al Masjid Al Haram Rd, 1.2 km to the Haram), and it
      drops the tourism licence row that OV 02.2 carries. We keep the
      licence. For the designer.

1440 and 393, both languages: nothing overflows, and the single-hotel
case reads `1 hotel selected` / `تأكيد وإرسال طلب واحد`.

## Two buttons that did nothing

Both reported from the running portal, and both were the same fault: a
control drawn, labelled, and wired to nothing.

### "Ask to change the bank" (UI 07.36)

The guide's entry point (P-01 I.01) sends it to the company-change flow
with the IBAN already picked: `Finance → Bank & payment terms → Request a
change → UI 01.6C, IBAN selected`.

- [x] It opens `/request-changes?select=iban`, and the detail arrives
      ticked. A detail already inside an open request is not ticked - the
      row there says which request holds it, which is the answer the
      supplier came for.
- [x] `bank.change` still gates the button itself: no key, no button, and
      a line naming who has it.

### The search in the top bar (OV CH.1)

The glass opened nothing at all. The guide (P1.3) fixes the shape, and
that is what it does now.

- [x] **One field, five groups, in the guide's order**: bookings, rates
      and availability, contracts, change requests, hotels. Five to a
      group with `See all` beside the heading, and a group with nothing
      in it is not drawn - an empty heading reads as a broken search
      rather than as an answer.
- [x] **Two characters, then a pause.** It starts at two and answers
      250ms after the last keystroke: a list that rewrites itself on
      every letter cannot be read while you are still typing.
- [x] **BR-00-24 — the guest's name.** Without `guest.pii` it is neither
      shown nor matched. A search that still matches on a hidden name
      hands it back to whoever guesses it.
- [x] **Every row opens its own record** - the booking, the request, the
      contract, the hotel - and closes the search behind it. A hotel you
      are not linked to has no page yet, so it opens the library.
- [x] **The line the guide fixes**: "Search only reaches what this
      account is allowed to…" sits under the results, where someone
      wondering why something is missing will read it.
- [x] `/` opens it (unless you are typing in a field), Enter opens the
      first result, Esc closes.

1440 and 393, both languages: `88198` finds its booking, `noor` fills
four groups with `See all 16` on the bookings, `zzzz` says so, and
nothing overflows.

## UI 02.1 · the card that would not change its mind

Reported from the portal: the request goes to Hoteliana and appears under
Requests, but the hotel keeps saying `Available` - with a checkbox to ask
for it again.

- [x] **A first visit is where hotels start, not a mask over the page.**
      `?state=first` forced every card to `available` for as long as you
      stayed on it, so nothing you sent could show. The store seeds a
      relation for every hotel, so the first visit cannot read from it
      either - it remembers what it has sent, and that is what the card,
      the checkbox and the banner all read now.
- [x] **UI 02.1D follows from it.** The banner used to be switched off on
      a first visit; it counts what is actually with Hoteliana, which is
      nothing until you send one and two once you have.
- [x] **"Sent 2 days ago" for a request sent a moment ago.** A hotel
      asked for in this session says `Sent just now`.
- [x] **Three more bare numbers.** "1 access requests are with
      Hoteliana", "{count} hotel(s) are now with Hoteliana" - a written
      down shrug - and the step numbers in the sent panel, Latin inside
      Arabic. All counted phrases now, with the English verb inside the
      phrase where the count moves it: `1 access request is`,
      `2 hotels are`, `طلبا وصول`, `فندقان`.

Both languages: ask for one, the card turns `Requested · Sent just now`
and the banner reads `1 access request is with Hoteliana`; ask for a
second and it reads `2 access requests are`.

## Three controls that did nothing, and the icon that was not there

- [x] **Withdraw request.** It closed the drawer and left the request
      exactly where it was. It withdraws now: the row leaves the list,
      and - because the panel promises "you can request the same hotel
      again later" - the hotel goes back to `Available` in the library in
      the same breath. Without that the promise was false: the library
      would still refuse to let you ask.
- [x] **Ask Hoteliana.** Same: it closed the drawer. It opens the case
      panel, and the case carries the request it came from. It used to
      say "Opened from: Executive Suite · Hilton Makkah · ROOM_NOT_MAPPED"
      wherever it was opened - another screen's example, attached to your
      case.
- [x] **The one action the drawer could not tell apart.** Every secondary
      button called the same handler with no argument, so the page could
      not know which had been pressed. It is handed the action now.
- [x] **Payments had no icon.** The frame left that row on the icon set's
      default variant - a white tick on a white panel - so Payments was
      the only row in the menu with nothing beside it. `payment.svg`, a
      note and a coin, drawn in the same hand as the others.

Checked live: withdrawing `ROM-20481` drops it from eleven rows to ten
with a toast; withdrawing `ACC-04830` puts Al Safa City back to
`Available` in the library; `Ask Hoteliana` on the rejected `ACC-04822`
opens a case that says `Hotel access · Jabal View Hotel · ACC-04822`.

