# The implementation guide

The designer's Product Owner specification, handed over on 27 September 2026
as a 383-page PDF and split here one file per flow. **771 numbered business
rules**, `BR-<flow>-<n>`, plus for every flow: the happy path, the alternative
and exception flows, **the states the design never draws**, the state machine,
fields and validation, notifications and the log, acceptance criteria, and the
designer's own open questions.

| File | Chapter | Rules |
|---|---|---|
| [flow-00.md](flow-00.md) | Portal-wide rules | 37 |
| [flow-01.md](flow-01.md) | Access & Account | 74 |
| [flow-02.md](flow-02.md) | Hotels & Access | 56 |
| [flow-03.md](flow-03.md) | Hotel supply contracts | 103 |
| [flow-04.md](flow-04.md) | Rates & Availability | 124 |
| [flow-04w.md](flow-04w.md) | Win list | — |
| [flow-05.md](flow-05.md) | Bookings | 44 |
| [flow-06.md](flow-06.md) | Change requests | 40 |
| [flow-07.md](flow-07.md) | Finance | 76 |
| [flow-08.md](flow-08.md) | Team, Access & Activity | 52 |
| [flow-09.md](flow-09.md) | Dashboard | 38 |
| [flow-10.md](flow-10.md) | Business exceptions | 60 |
| [flow-11.md](flow-11.md) | Notifications, system & empty states | 67 |

## Which source wins

1. **This guide** — the newest, and the only one with numbered rules.
2. [`../front-end-states.md`](../front-end-states.md) — the state tables, with
   the **مرسومة؟** column saying which states Figma draws.
3. The Figma `REF` pages — engineering rules, which beat the screens.
4. The `UI` / `OV` frames themselves.

A screen drawn twice is the Flow 12 one.

## Reading it

The PDF stores Arabic in visual order, so every line was reversed back into
logical order. Pure Arabic lines came out clean; a line mixing Arabic with
Latin identifiers can still read out of order. When a rule looks garbled, the
PDF on the designer's desk is the original.

Rules are cited in code as `BR-00-21` and the like, so a comment can point at
the sentence it implements.
