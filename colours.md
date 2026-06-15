# Brand Colours — Future-Life Diagnostics Laboratory & Medical Technologies

Extracted directly from the official brand materials (logo + marketing flyers) in `/references`.

---

## Primary Palette

| Role | Name | HEX | RGB | Swatch |
|------|------|-----|-----|--------|
| Primary | Navy / Indigo | `#243C6C` | 36, 60, 108 | 🟦 |
| Accent | Leaf Green | `#60B43C` | 96, 180, 60 | 🟩 |
| Base | White | `#FFFFFF` | 255, 255, 255 | ⬜ |

---

## Extended Palette (for UI & documents)

| Role | Name | HEX | RGB | Usage |
|------|------|-----|-----|-------|
| Primary | Navy / Indigo | `#243C6C` | 36, 60, 108 | Headings, nav, primary buttons, section markers |
| Primary – deep | Deep Navy | `#1A2C50` | 26, 44, 80 | Gradients, footers, hero backgrounds |
| Primary – soft | Soft Navy Tint | `#E9EDF6` | 233, 237, 246 | Callout/card backgrounds |
| Accent | Leaf Green | `#60B43C` | 96, 180, 60 | CTAs, highlights, icons, accent bars |
| Accent – ink | Green Ink | `#3E7A1E` | 62, 122, 30 | Green text on light backgrounds (legibility) |
| Accent – soft | Soft Green Tint | `#EBF5E3` | 235, 245, 227 | Tags, pill backgrounds, subtle fills |
| Neutral | Ink (body text) | `#1F2933` | 31, 41, 51 | Body copy |
| Neutral | Muted Text | `#5B6B7B` | 91, 107, 123 | Secondary/caption text |
| Neutral | Hairline | `#D9E2EC` | 217, 226, 236 | Borders, dividers, table rules |

---

## CSS Variables

```css
:root{
  --blue:        #243C6C;  /* primary navy */
  --blue-deep:   #1A2C50;  /* deep navy   */
  --blue-soft:   #E9EDF6;  /* soft navy tint */
  --green:       #60B43C;  /* leaf green accent */
  --green-ink:   #3E7A1E;  /* green text on light */
  --green-soft:  #EBF5E3;  /* soft green tint */
  --ink:         #1F2933;  /* body text   */
  --muted:       #5B6B7B;  /* secondary   */
  --line:        #D9E2EC;  /* borders     */
}
```

---

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy:      '#243C6C',
          'navy-deep':'#1A2C50',
          'navy-soft':'#E9EDF6',
          green:     '#60B43C',
          'green-ink':'#3E7A1E',
          'green-soft':'#EBF5E3',
        },
      },
    },
  },
};
```

---

## Usage Guidance

- **Navy** is the dominant brand colour — use it for structure: headings, navigation, primary buttons, and large surfaces.
- **Green** is the accent — use it sparingly for emphasis: calls-to-action, highlights, icons, and accent bars. Avoid large green fills.
- **White** is the canvas — keep layouts clean and content-first with generous whitespace.
- For green **text** on white, use `--green-ink` (`#3E7A1E`) rather than the bright accent green to maintain readability.
- Pair navy text on white and white text on navy for the strongest contrast.

---

*Source: F-LDx logo and Future-Life Diagnostics marketing flyers (`/references`). Colours sampled via HSV clustering of saturated brand pixels.*
