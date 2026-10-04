---
name: figma-match
description: Match this codebase to the Hoteliana Supplier Product UX Figma file, frame by frame. Use whenever the work is "make the screen match Figma", auditing a flow (UI/OV frame ids like UI 04.1 or OV 05.15), wiring a button whose behaviour is drawn in the prototype, or checking copy, geometry and interactions against the design. Covers reading the file, running the prototype, the three-way verification, when to stop and ask, and how to log contradictions.
---

# Matching Hoteliana to Figma

The design is the specification. Render what the frame draws, applied
correctly — including where the frame contradicts itself. Never invent a
number, a label or a behaviour that the file does not contain.

## Four sources, in this order

**1. `docs/guide/` — the implementation guide.** The designer's Product Owner
specification (27 Sep 2026, 383 pages), one file per flow, **771 numbered
business rules** `BR-<flow>-<n>`. Each chapter also carries the happy path,
the alternative and exception flows, the states the design never draws, the
state machine, fields and validation, notifications and the log, acceptance
criteria, and the designer's open questions. This is the newest and the most
specific source: when it names a rule, that rule wins.

**2. `docs/front-end-states.md`** — the front-end state tables, with a
**مرسومة؟** column: ✓ the frame draws it, ✗ it is not drawn and must be
built from the description beside it.

**3. Figma `REF` pages** — engineering rules, which beat the screens.

**4. The `UI` / `OV` frames themselves.** A screen drawn twice is the Flow 12
one.

Before touching a flow, read its chapter in `docs/guide/` and its table in
`front-end-states.md`. Cite the rule in the code comment — `BR-00-21`, not
"the spec says" — so the next reader can find the sentence.

Inside Figma, a screen that exists in both its own flow and in Flow 12 is
the Flow 12 one.

## The file

| | |
|---|---|
| fileKey | `dngSf3gYi1TxeWLoV9TBCi` |
| page | `06 - Supplier Final UI · own components` (id `3282:115797`) |
| sections | `Flow 01 …` – `Flow 11 …`, `Chrome`, `Components`, `Modal slots - 06` |
| frame ids | `UI <flow>.<n>` a screen · `OV <flow>.<n>` an overlay · `REF <flow>.R` an engineering sheet with no UI |
| overlays | an `OV` frame is usually an empty 1440×1024 slot; the real content is a component of the same name under `Modal slots - 06` |
| page size | 1440 wide, 40px gutters, so a body is **1360** |
| font | Readex Pro |

`use_figma` resets to the first page each call, so every script starts with
`await figma.setCurrentPageAsync(page)` — at most once per call.

## Ask before you build

Guessing is the expensive failure here: a wrong guess is written into code,
committed, and then re-read as if it were the design. **Stop and ask the user**
when any of these is true. Ask with `AskUserQuestion`, in one batch, and keep
working on everything that does not depend on the answer.

1. **The frame and the request disagree.** The user asks for a day/month/year
   picker and the frame draws a month grid. Do not silently pick one.
2. **The frame contradicts another frame** on a number, a label or a state, and
   the two cannot both be rendered. (If they *can* both be rendered — two
   different screens — render both and log it, do not ask.)
3. **A control is drawn with no destination**: no prototype reaction, no
   overlay of its name, and no text saying what it does.
4. **The data is not in the file.** A count, a price or a date the frames never
   print, and which the demo data does not already hold.
5. **Scope is ambiguous**: "fix the buttons" over a page with eleven of them.
   Ask which, or state the list you are about to do and start at the top.

Do **not** ask about anything the file answers. Read the frame first — most
"unclear" turns out to be a node property away.

## Reading a frame

Work from cheapest to dearest:

1. `get_metadata` — the tree, ids, x/y/width/height. Start here. Large frames
   blow the token limit; the result is then written to a file, so parse that
   file instead of re-requesting.
2. `use_figma` — everything metadata leaves out: `characters`, `fontSize`,
   `fontName.style`, `letterSpacing`, `textCase`, `fills`, `strokes`,
   `dashPattern`, `cornerRadius`, `paddingLeft/Right/Top/Bottom`, `itemSpacing`,
   `effects`, and **`reactions`** (see below). Return a compact object — the
   whole point is to not pay for the tree twice.
3. `get_screenshot` — the render. A tall frame comes back too small to read at
   `maxDimension 1440`; screenshot its **sections** instead, at their natural
   width, then stitch them with Pillow into one image and read that. Download
   with `curl` (the URL is short-lived), never inline base64.

## Running the prototype

The prototype is how the design says what a control *does*. Read it from the
file rather than driving it in a browser — `node.reactions` gives the trigger,
the action and the destination node id, which is exactly what wiring a button
needs, and it needs no Figma session.

```js
const page = figma.root.children.find(p => p.name === "06 - Supplier Final UI · own components");
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync("<UI frame id>");
const out = [];
const walk = (n) => {
  for (const r of n.reactions ?? []) {
    const a = r.action ?? (r.actions && r.actions[0]);
    if (!a) continue;
    out.push({
      from: n.name, id: n.id,
      trigger: r.trigger && r.trigger.type,
      action: a.type,                       // NODE | URL | BACK | CLOSE | OVERLAY …
      to: a.destinationId ?? a.url ?? null,
      nav: a.navigation ?? null,            // NAVIGATE | OVERLAY | SWAP …
    });
  }
  if ("children" in n) n.children.forEach(walk);
};
walk(frame);
return out;
```

Resolve each `to` with `getNodeByIdAsync` to get the destination's name, and
turn it into a link the user can open:

```
https://www.figma.com/design/dngSf3gYi1TxeWLoV9TBCi/Hoteliana-%E2%80%94-Supplier-Product-UX?node-id=<id with : replaced by ->&m=dev
```

A control with **no** reaction is not automatically dead — check for an `OV`
frame or a `Modal slots` component that carries its name before concluding it,
and if nothing names it, ask (rule 3 above).

## Verifying — all three, every time

A screen is not matched until it has passed all three. Reading the code is not
one of them.

**1. Copy, both ways.** Every string the frame prints must exist in the app, and
every string the app prints on that screen must exist in the frame. Pull the
frame's strings into a JSON file and grep `src/`; template-composed strings
("6 of 9 room types priced") produce false negatives, so confirm every "missing"
against the live DOM before changing anything.

**2. Geometry, measured.** Set the viewport to **1440×1024**, then read
`getBoundingClientRect()` from the live DOM and compare against the frame's
x/y/width/height. Widths, heights, gaps, row pitch, font sizes, line heights.
±1px is a match (the app's 1px borders); ±8px is not.

**3. Screenshots, side by side.** Capture the frame and capture the page, and
look at them. Three whole-app defects in this project were invisible to both
of the checks above and obvious on sight.

### Every screen size, always

The file only draws 1440, so Figma's numbers are the **desktop case, not the
only case**. A screen that holds together at 1440 and breaks at 768 is not
matched, it is half matched.

- Put Figma's exact widths behind a breakpoint (`lg:grid-cols-[504px_1px_…]`),
  and give the same element a sane stacked fallback below it.
- A fixed width is written `w-[393px] max-w-full`, never `w-[393px]` alone.
- A fixed grid of cells (a calendar, the rate grid) keeps its pixel size where
  there is room and falls back to fractions where there is not — `min-w-`
  plus `1fr` rather than a hard `w-`.
- Verify at **1440, 768 and 393**, and in Arabic RTL at 393, before calling a
  screen done. No horizontal page scroll at any of them.

### Browser gotchas

- `computer:zoom` with any region returns the **full viewport** ("region crop
  not yet supported") — that is the reliable capture. Plain `screenshot` often
  returns a magnified crop of the top-left.
- To capture a long page in one image, set the viewport tall
  (`resize_window` 1440×3200) rather than scrolling — scrolled captures come
  back blank.
- `resize_window` is cleared at the end of every turn. Re-apply it.
- A screenshot taken right after opening a menu catches it mid fade-in, and a
  second capture often closes it. Verify menus by measuring, screenshot once.
- Radix `zoom-in-95` means a menu measured immediately after opening reads 95%
  of its real size. Wait ~700ms or divide by 0.95.
- Setting a React input's value needs the native setter plus
  `new Event("input", { bubbles: true })`. Programmatic `.click()` works;
  `onFocus` does not fire reliably, so prefer `onClick`.
- Stale HMR errors survive file deletes — confirm in a fresh tab.

## Writing the change

- Bilingual copy: `Bi = { en, ar }` with `const t = (en, ar) => ({ en, ar })`,
  read as `value[k]` where `k = lang === "ar" ? "ar" : "en"`. Older screens use
  the `dict*.ts` / `*-copy.ts` pattern where `ar` must mirror `en` key for key.
  **Write the Arabic yourself** — do not leave English in the Arabic tree.
- `exactOptionalPropertyTypes` is on: an optional prop that may receive
  `undefined` is typed `X | undefined`.
- Numbers the design prints but the data cannot derive (chip counts, totals)
  are held as named constants beside the component, commented with the frame
  that prints them.
- `cn()` is tailwind-merge: `text-overline` looks like a colour utility to it
  and is dropped when a `text-*` colour follows in the same call. Spell the
  overline out (`text-[11.5px] font-semibold uppercase …`) inside `cn()`.
- Readex Pro measures ~4% wider in a browser than in Figma. When a label
  overflows a box the frame fits it into, add `tracking-[-0.04em]` rather than
  widening the box — and log it.

## Finishing

1. `npx tsc --noEmit`, then `npx vite build`. Both must pass.
   (`npm run lint` fails repo-wide on pre-existing CRLF/prettier noise — leave it.)
2. Log every design contradiction in `roadmap.md` under
   *"Design inconsistencies, now rendered as Figma draws them"*, one line each,
   naming the frame.
3. `rm -f package-lock.json`, then commit **one flow per commit**, subject
   naming the frames (`OV 05.9 / 05.15 … — the five menus the list opens`).
4. Report in Arabic, briefly: what changed, what is left, what you had to ask.

Never force-push, rebase or amend a pushed commit — the branch syncs to Lovable.
