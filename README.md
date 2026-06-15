# Future-Life Diagnostics Laboratory & Medical Technologies

Official company profile website for **Future-Life Diagnostics Laboratory & Medical Technologies** — a certified private medical laboratory delivering accurate, reliable, and affordable diagnostic solutions across Malawi.

> _"A Healthy Life Brings Happiness"_

Live site: https://unclestrong265.github.io/future-life-diagnostics/
Custom domain: https://futurelifediagnostics.com/

---

## About

Future-Life Diagnostics combines advanced technology, scientific expertise, and exceptional
customer service to improve healthcare outcomes for individuals, healthcare providers,
organizations, and researchers. This is a modern, single-page company profile presenting the
company's mission, values, and full service portfolio.

## Features

- 📱 **Fully responsive** — mobile menu, adapts to all screen sizes
- 🎨 **On-brand** — navy `#243C6C` + leaf green `#60B43C` (see [colours.md](colours.md))
- ⚡ **Fast & lightweight** — compiled Tailwind CSS, no heavy framework
- 🧭 **Clear navigation** — sticky nav with smooth-scroll anchored sections
- ☎️ **Clickable contacts** — tap-to-call, email, WhatsApp, and Google Maps
- 🔗 **Social links** — Facebook, Instagram, TikTok, LinkedIn, X
- 🔍 **SEO & share-ready** — meta description, Open Graph / Twitter card tags, favicon

### Sections

Hero · Company Overview · Vision & Mission · Core Values (C.H.E.S.T.C.R) ·
Service Portfolio (Diagnostics, Preventive Health, Occupational Health, Training,
Research, Medical Technologies) · Our Clients · Why Choose Us · Contact

## Tech stack

| | |
|---|---|
| Markup | HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) (compiled, self-hosted) |
| Icons | [Iconify](https://iconify.design) |
| Fonts | Inter & Poppins (Google Fonts) |
| Hosting | GitHub Pages (static) |

---

## Project structure

```
index.html            → the website
src/input.css         → Tailwind source (edit styles here)
tailwind.config.js    → theme / brand colours
dist/output.css       → COMPILED stylesheet (generated — do not edit by hand)
logo-emblem.png       → F-LDx logo
hero-lab.png          → hero background image
```

## Editing & building

If you change any Tailwind classes in `index.html` (or styles in `src/input.css`),
rebuild the stylesheet:

```bash
npm install        # first time only
npm run build      # rebuild dist/output.css (minified)
```

While actively editing, auto-rebuild on save:

```bash
npm run dev        # watches and rebuilds automatically
```

> If you only edit text/content (not classes), no rebuild is needed.

## Deploying

The site is fully static. For **GitHub Pages**: push to your repo, then go to
**Settings → Pages → Source: `main` branch / `(root)` → Save**.

To host elsewhere (Netlify, Vercel, Cloudflare Pages), upload these files:

```
index.html
dist/output.css
logo-emblem.png
logo-lockup.png
hero-lab.png
```

## PayChangu payments

The online payment form uses a Netlify Function so the PayChangu secret key stays
server-side. Deploy the repository on Netlify and add these environment variables:

```
PAYCHANGU_SECRET_KEY=your_client_secret_key
PAYCHANGU_CURRENCY=MWK
SITE_URL=https://your-live-site-url
```

Use `npm run build:deploy` before publishing static changes. The Netlify build is
already configured in `netlify.toml`.

---

## Contact

**Future-Life Diagnostics Laboratory & Medical Technologies**
📍 Future-Life Laboratory Complex, Chendawaka Street, Area 25A, Lilongwe, Malawi
☎ +265 888 640 728 · +265 980 855 554 · +265 995 825 705
✉ futurelifediagnostics@gmail.com

---

© 2026 Future-Life Diagnostics. All rights reserved.
