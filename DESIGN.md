---
name: Word by Word — Bulgarian Passphrases
description: A bilingual, local-first Bulgarian passphrase reading room.
colors:
  plum: "#51364f"
  plum-deep: "#3b293d"
  mint-ground: "#e9f2ec"
  mint-soft: "#dcebe1"
  paper: "#f5f8f4"
  panel: "#e2eee6"
  ink: "#302438"
  muted: "#625969"
  subtle: "#756f79"
  line: "#c8d8ce"
  selected: "#dcebe1"
  focus: "#715572"
  error: "#a43e4b"
  success: "#3e6956"
  dark-ground: "#211927"
  dark-paper: "#2c2432"
  dark-panel: "#30283a"
  dark-ink: "#eee8ef"
  dark-muted: "#c2b7c6"
  dark-line: "#514457"
  dark-selected: "#3a3140"
  dark-focus: "#d0b5d0"
  dark-error: "#ffafb8"
  dark-success: "#b4d8c0"
typography:
  display:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  headline:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "18px"
    fontWeight: 650
    letterSpacing: "-.015em"
  phrase:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.42
    letterSpacing: "-.025em"
  body:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'system-ui, "Noto Sans", sans-serif'
    fontSize: "11px"
    fontWeight: 750
    letterSpacing: ".12em"
  mono:
    fontFamily: 'ui-monospace, "SFMono-Regular", Consolas, monospace'
    fontSize: "14px"
    fontWeight: 400
rounded:
  sm: "7px"
  md: "8px"
  lg: "10px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  2xl: "22px"
  3xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "#faf7fa"
    rounded: "{rounded.md}"
    height: "46px"
    typography: "{typography.body}"
  button-secondary:
    backgroundColor: "#f7faf6"
    textColor: "{colors.plum}"
    rounded: "{rounded.md}"
    height: "40px"
    typography: "{typography.body}"
  card-result:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "25px"
  card-settings:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "22px"
  input:
    backgroundColor: "#f4f8f3"
    textColor: "#393342"
    rounded: "{rounded.sm}"
    height: "38px"
  chip:
    backgroundColor: "#e8f1e9"
    textColor: "#42624f"
    rounded: "{rounded.sm}"
    padding: "6px 9px"
  tab-selected:
    backgroundColor: "{colors.selected}"
    textColor: "#3f5d4a"
    rounded: "{rounded.sm}"
    height: "34px"
---

# Design System: Word by Word — Bulgarian Passphrases

## Overview

**Creative North Star: "The Bilingual Reading Room"**

Word by Word treats the generated Bulgarian phrase as the working material, not a teaser for a marketing page. A compact identity and appearance control give way to a brief purpose statement and a clear reading surface. Script choice, copy, and regeneration stay close to the result; customization sits beside it on wide screens and follows it on mobile.

Cool mint and muted green carry the light workspace, while plum gives the interface its identity and primary action. System UI typography supports Cyrillic and Latin text without an external font dependency. Depth comes from lightly tinted surfaces and fine rules, not card shadows. The same layout vocabulary shifts into a plum-dark theme through the manual or system appearance setting.

**Key Characteristics:**
- Result-first, bilingual reading workspace with settings kept nearby.
- Restrained plum, mint, and green selection colors across light and dark themes.
- Quiet borders and tonal surfaces; rounded controls and readable phrase wrapping.

## Colors

The light palette pairs deep plum text and actions with a cool mint ground, pale paper surfaces, and muted green states; dark mode shifts the ground and panels to plum-charcoal while preserving green selection cues.

### Primary
- **Reading-room Plum** (`{colors.plum}`): Primary Generate action, brand accent, and key control text in light mode.
- **Deep Plum Ink** (`{colors.plum-deep}`): Headline and phrase emphasis in light mode.

### Secondary
- **Muted Leaf Green** (`#3e6956`): Success/status feedback in light mode.
- **Cool Mint Selection** (`{colors.selected}`): Selected writing-system tab and low-emphasis selection surfaces.

### Neutral
- **Cool Mint Ground** (`{colors.mint-ground}`): Light page backdrop.
- **Soft Paper** (`{colors.paper}`): Result card and other light working surfaces.
- **Tinted Panel** (`{colors.panel}`): Settings panel background.
- **Ink** (`{colors.ink}`): Root foreground for light mode.
- **Muted Ink** (`{colors.muted}`): Supporting copy and privacy notes.
- **Quiet Ink** (`{colors.subtle}`): Less prominent secondary text.
- **Mint Rule** (`{colors.line}`): Light borders and dividers.
- **Focus Plum** (`{colors.focus}`): Visible keyboard-focus outline.
- **Error Berry** (`{colors.error}`): Error feedback.
- **Dark Plum Ground** (`{colors.dark-ground}`): Dark-mode page backdrop.
- **Dark Paper** (`{colors.dark-paper}`): Dark-mode result surface.
- **Dark Tinted Panel** (`{colors.dark-panel}`): Dark-mode settings and controls.
- **Dark Ink** (`{colors.dark-ink}`): Dark-mode primary text.
- **Dark Muted Ink** (`{colors.dark-muted}`): Dark-mode supporting text.
- **Dark Rule** (`{colors.dark-line}`): Dark-mode borders and dividers.
- **Dark Selection** (`{colors.dark-selected}`): Dark-mode selected writing-system state.
- **Dark Focus Plum** (`{colors.dark-focus}`): Dark-mode keyboard focus color.
- **Dark Error Berry** (`{colors.dark-error}`): Dark-mode errors.
- **Dark Mint Success** (`{colors.dark-success}`): Dark-mode success feedback.

### Named Rules
**The Plum-and-Mint Rule.** Use plum for identity and primary actions, and reserve green-tinted surfaces and text for selected or successful states; keep the same semantic distinction in dark mode.

## Typography

**Display Font:** System UI, with Noto Sans and generic sans-serif fallbacks  
**Body Font:** System UI, with Noto Sans and generic sans-serif fallbacks  
**Label/Mono Font:** System UI for labels; `ui-monospace`, SFMono-Regular, Consolas, monospace for the editable separator string.

**Character:** A practical, Cyrillic-capable sans-serif carries both scripts without a downloaded typeface. Compact labels establish hierarchy, while the phrase is larger and line-spaced to remain readable when long or wrapped.

### Hierarchy
- **Display** (650, 28px, 1.2): Desktop purpose heading; contracts to 24px on narrow screens.
- **Headline** (650, 24px, 1.2): Narrow-screen heading.
- **Title** (650, 18px): Settings panel title.
- **Phrase** (600, 27px, 1.42): Generated result; 23px at widths up to 520px and 21px at widths up to 360px.
- **Body** (400, 14px, 1.6): Introductory text and general supporting copy; intro text is 13px on narrow screens.
- **Label** (750, 11px, .12em): Uppercase, letter-spaced passphrase section label.
- **Control label** (650, 13px): Settings labels; regular-case UI copy.

### Named Rules
**The Phrase-First Type Rule.** Keep the generated phrase visibly larger than controls and supporting copy; use the system sans stack for Bulgarian and Romanized readings rather than introducing a display face.

## Layout

The desktop shell is centered at `min(100% - 48px, 1120px)`. The workspace uses a two-column grid (`minmax(0, 1.08fr) minmax(330px, .92fr)`) with a full-width heading row, 36px column gap, and 22px row gap. Result and settings panels therefore sit side by side, with the result slightly wider. The settings controls use a two-column grid; the number option and advanced disclosure span both columns.

At 780px and below, the workspace becomes one column, with result before settings; the shell is capped at 620px and uses 18px section gaps. At 520px and below, the shell is `min(100% - 30px, 460px)`, panel padding is 17px, and the controls stack. Copy is intentionally placed below the full-width phrase in its result surface; tabs and the conditional rules link wrap as needed. At 360px and below, the shell uses 12px side gutters, tab spacing and padding tighten, and the rules link can wrap onto its own line. The layout supports a 320px viewport.

Spacing is a compact 4px-based rhythm, with recurring 8px, 12px, 16–18px, 22–25px, and 32–36px gaps and insets. On mobile, interactive controls target at least 44px in height, while the phrase surface retains generous internal breathing room. The footer is centered, constrained to 75ch, and separated from the workspace.

### Named Rules
**The Result-Before-Settings Rule.** Keep the result first in the reading order; place settings beside it on wide screens and below it on narrow screens.

## Elevation & Depth

The interface is predominantly flat. Border lines and tonal separation between the mint ground, paper result, and tinted settings panel establish depth without card shadows. The two small shadows in the stylesheet are limited to the privacy status dot's halo and the range slider thumb; they are not a general elevation treatment.

### Shadow Vocabulary
- **Privacy status halo** (`0 0 0 3px #d2e6d8`): Small light-mode ring around the privacy dot; dark mode uses `0 0 0 3px #344339`.
- **Range thumb** (`0 1px 3px #4936503d`): Subtle separation beneath the range control thumb.

### Named Rules
**The Tonal-Surface Rule.** Separate working regions with lightly tinted fills and fine borders; do not add ambient card shadows.

## Shapes

Controls and containers use a quiet, consistent rounded-rectangle language, with most corners between 7px and 12px. Inputs and tabs are more compact than the 10–12px panel and result surfaces. Borders are thin and low contrast, and no panel relies on clipping or decorative geometry.

## Components

### Buttons
- **Character:** Compact, plainly labeled actions with restrained hover feedback.
- **Shape:** Gently rounded corners (8px).
- **Primary:** Full-width plum Generate button, light text, centered icon and label, 46px minimum height, and 9px icon gap.
- **Secondary:** Copy is a small outlined button beside the result on desktop and below the phrase on mobile; its minimum height is 40px on desktop and 44px at narrow widths.
- **Hover / Focus:** Hover lifts enabled buttons by 1px and adjusts fill or border. Active primary/copy buttons move down 1px. Keyboard focus uses a 3px `color-mix` outline at 3px offset.
- **Disabled:** Generate waits while the dictionary loads; Copy is disabled until a phrase exists.

### Chips
- **Style:** The word-count chip uses a pale green fill, muted green text, a fine green border, 7px corners, and tabular numerals.
- **State:** The selected script tab uses a green-tinted fill and stronger green text; other tabs stay quiet until hover.

### Cards / Containers
- **Corner Style:** Rounded 12px outer corners for result and settings panels.
- **Background:** Paper for the result; muted mint panel for settings; a more distinctly tinted result box keeps the phrase legible.
- **Shadow Strategy:** Flat at rest; see Elevation & Depth for the two small local shadows.
- **Border:** 1px low-contrast mint or plum-toned border.
- **Internal Padding:** Result 25px and settings 22px on desktop; both use 17px on narrow screens.

### Inputs / Fields
- **Style:** Light controls use a pale fill, 1px border, 7px corners, and 38px minimum height on desktop; narrow-screen selects and text/number inputs use 44px minimum height and 16px text.
- **Focus:** A 3px visible outline, offset by 3px, is shared with buttons, links, and disclosure summaries.
- **Error / Disabled:** Disabled fixed-separator selection uses a dashed border and subdued fill while random separator mode is active. Errors use the semantic error color.
- **Range:** The slider has a 5px track and circular 18px WebKit thumb, with plum accent in light mode and a pale plum thumb in dark mode.

### Navigation

- **Style:** The writing-system switch is a compact tab list with Cyrillic and Romanized labels and script hints.
- **Default / Active:** The selected tab receives a bordered muted-green fill and heavier text; inactive tabs remain transparent and gain a subtle tint on hover.
- **Mobile:** Tabs wrap with the conditional BGN/PCGN rules link below or beside them as space permits.
- **Keyboard:** Left/Right Arrow and Home/End move selection and focus; the inactive tab is removed from sequential tab order.

### Passphrase Reading Surface

The result box presents the phrase as the primary content, allows arbitrary long strings to wrap, and pairs it with Copy. Changing script updates the same live result panel and its language metadata. The selected script triggers a short opacity/vertical transition; reduced-motion preferences shorten transitions and animations to near-immediate.

### Appearance Control

The header control cycles between system, light, and dark appearance; its accessible label reports the current mode and how activation changes it. System appearance follows the OS color preference, with the mode saved separately from generator preferences.

### Advanced Options

The settings panel uses a native disclosure to progressively reveal editable random separators, random-number length, and capitalization. Its summary communicates the scope of options; the expanded state reveals its chevron direction and control set. Settings and selected writing system persist in browser storage.

## Do's and Don'ts

### Do:
- **Do** keep the generated phrase and its Copy action together as the most prominent work surface.
- **Do** retain the responsive composition: settings beside the result on desktop, below it on mobile.
- **Do** use the existing system UI sans stack for both Bulgarian Cyrillic and Romanized text.
- **Do** use fine borders and lightly tinted surfaces to distinguish result and settings regions.
- **Do** preserve clear selected, focus-visible, disabled, success, and error states.
- **Do** allow long phrases, tabs, and rules references to wrap within narrow viewports.

### Don't:
- **Don't** introduce a downloaded typeface or decorative display face into this system.
- **Don't** use large ambient shadows to lift cards; depth is conveyed by surface tone and quiet rules.
- **Don't** make Copy compete with the phrase or place settings before the result in the mobile flow.
