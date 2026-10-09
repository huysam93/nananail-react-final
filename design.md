# Design — NanaNail Đà Lạt

A locked design system for NanaNail Web Application. Updated based on user feedback: Soft Light Pink & Soft Blush palette, clean airy background (NO dark blocks).

## Genre
`modern-minimal` (Soft Light Pink & Blush Aesthetic - airy, elegant, feminine, clean)

## Macrostructure Family
- **Marketing pages (HomePage):** Bento Grid + Light Air Blocks (Soft blush cards, clean whitespace, light pink highlights).
- **Sub-pages:** Catalogue & Long Document format with soft pastel backgrounds.

## Theme Tokens (Soft Light Pink Palette)
- `--color-paper`: `oklch(99.5% 0.005 350)` /* Crisp warm white #FFFFFF / #FAFAFA */
- `--color-paper-2`: `oklch(97.5% 0.015 350)` /* Soft Blush Pink tint #FFF1F2 */
- `--color-paper-3`: `oklch(94.5% 0.028 350)` /* Rose Pink highlight #FDE8F0 */
- `--color-ink`: `oklch(25% 0.02 340)` /* Warm Dark Espresso text */
- `--color-ink-2`: `oklch(50% 0.02 340)` /* Muted Rose-Taupe body text */
- `--color-rule`: `oklch(92% 0.02 345)` /* Hairline Soft Rose border */
- `--color-accent`: `oklch(58% 0.20 345)` /* Elegant Rose Pink #DB2777 */
- `--color-accent-hover`: `oklch(50% 0.22 345)` /* #BE185D */
- `--color-accent-soft`: `oklch(96% 0.02 345)` /* #FFF1F2 */
- `--color-focus`: `oklch(58% 0.20 345)`

## Typography
- **Display:** `Playfair Display`, serif, weight 600/700
- **Body:** `Inter`, sans-serif, weight 400/500

## Design Principles
1. **LIGHT & AIRY:** Strictly NO dark/black background containers. Keep backgrounds white, soft blush, or delicate rose tint.
2. **SOFT PINK ELEGANCE:** Use soft rose borders (`border-pink-100`), subtle glowing pink accents, and blush cards (`bg-[#FFF1F2]`).
3. **CLEAN BENTO LAYOUT:** Maintain structured non-repetitive bento grid layouts without cluttering.

## Exports

### tokens.css (`frontend/src/tokens.css`)
```css
:root {
  --color-paper: oklch(99.5% 0.005 350);
  --color-paper-2: oklch(97.5% 0.015 350);
  --color-paper-3: oklch(94.5% 0.028 350);
  --color-ink: oklch(25% 0.02 340);
  --color-ink-2: oklch(50% 0.02 340);
  --color-rule: oklch(92% 0.02 345);
  --color-accent: oklch(58% 0.20 345);
  --color-accent-hover: oklch(50% 0.22 345);
  --color-accent-soft: oklch(96% 0.02 345);
  --color-focus: oklch(58% 0.20 345);

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --radius-card: 1rem;
  --radius-pill: 9999px;
  --radius-input: 0.75rem;
}
```
